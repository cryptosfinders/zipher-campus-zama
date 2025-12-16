'use client'

/**  -------------------------------------------------------------
 *  ZIPHER CAMPUS – MEDIA FIELDS
 *  • Convex POST uploads
 *  • api.media.save + api.media.getUrl
 *  • Thumbnail + gallery with Zipher UI
 *  ------------------------------------------------------------- */

import { ImageIcon, Link2, Trash2, UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useConvex, useMutation } from 'convex/react'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { isStorageReference, toStorageSource } from '@/lib/media'

import { MediaDropzone } from './media-dropzone'
import {
  generateGalleryId,
  isValidMediaReference,
  normalizeMediaInput
} from '../utils/media'

/* ---------------------------------------------------------------------- */
/* Types                                                                  */
/* ---------------------------------------------------------------------- */

type GalleryItem = {
  id: string
  url: string
  source: string
  storageId?: string
}

type GroupMediaFormShape = {
  [key: string]: any
}

interface GroupMediaFieldsProps<FormValues extends GroupMediaFormShape> {
  form: UseFormReturn<FormValues>
  // returns the POST upload URL from Convex
  requestUploadUrl: () => Promise<string>
  thumbnailField?: Path<FormValues>
  galleryField?: Path<FormValues>
  maxGalleryItems?: number
  initialMedia?: {
    thumbnailUrl?: string | null
    thumbnailSource?: string | null
    gallery?: {
      url: string
      source: string
      storageId?: string
    }[]
  }
}

const DEFAULT_MAX_GALLERY_ITEMS = 10

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

function isYouTubeUrl(value: string | null | undefined): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()
    return (
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host.endsWith('.youtube.com')
    )
  } catch {
    return false
  }
}

/* ---------------------------------------------------------------------- */
/* Component                                                              */
/* ---------------------------------------------------------------------- */

export function GroupMediaFields<FormValues extends GroupMediaFormShape>({
  form,
  requestUploadUrl,
  thumbnailField,
  galleryField,
  maxGalleryItems = DEFAULT_MAX_GALLERY_ITEMS,
  initialMedia
}: GroupMediaFieldsProps<FormValues>) {
  const convex = useConvex()
  const saveMedia = useMutation(api.media.save)

  const thumbnailPath = thumbnailField ?? ('thumbnailUrl' as Path<FormValues>)
  const galleryPath = galleryField ?? ('galleryUrls' as Path<FormValues>)

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [galleryLinkInput, setGalleryLinkInput] = useState('')

  const thumbnailObjectUrlRef = useRef<string | null>(null)
  const galleryObjectUrlsRef = useRef<string[]>([])

  /* ------------------------ INITIAL RESTORE ------------------------ */

  const initialThumbnailSource = normalizeMediaInput(
    initialMedia?.thumbnailSource ??
      (form.getValues(thumbnailPath) as string | undefined | null)
  )

  const initialThumbnailPreview = useMemo(() => {
    const provided = normalizeMediaInput(initialMedia?.thumbnailUrl)
    if (provided) return provided
    if (initialThumbnailSource) return initialThumbnailSource
    return null
  }, [initialMedia?.thumbnailUrl, initialThumbnailSource])

  const initialGalleryItems = useMemo<GalleryItem[]>(() => {
    if (initialMedia?.gallery?.length) {
      return initialMedia.gallery
        .map(item => {
          const src = normalizeMediaInput(item.source)
          if (!src) return null
          return {
            id: generateGalleryId(item.storageId ?? src),
            url: normalizeMediaInput(item.url) || src,
            source: src,
            storageId: item.storageId ?? undefined
          }
        })
        .filter(Boolean) as GalleryItem[]
    }

    const existing = form.getValues(galleryPath) as string[] | undefined
    return (existing ?? []).map(src => ({
      id: generateGalleryId(src),
      url: src,
      source: src
    }))
  }, [form, galleryPath, initialMedia?.gallery])

  const [thumbnailPreview, setThumbnailPreview] =
    useState<string | null>(initialThumbnailPreview)

  const [thumbnailTab, setThumbnailTab] = useState<'upload' | 'link'>(
    initialThumbnailSource
      ? isStorageReference(initialThumbnailSource)
        ? 'upload'
        : 'link'
      : 'upload'
  )

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(initialGalleryItems)
  const [galleryTab, setGalleryTab] = useState<'upload' | 'links'>(
    initialGalleryItems.some(i => isStorageReference(i.source))
      ? 'upload'
      : 'links'
  )

  const galleryItemsRef = useRef<GalleryItem[]>(initialGalleryItems)
  useEffect(() => {
    galleryItemsRef.current = galleryItems
  }, [galleryItems])

  /* ------------------------ CLEANUP ------------------------ */

  useEffect(
    () => () => {
      if (thumbnailObjectUrlRef.current)
        URL.revokeObjectURL(thumbnailObjectUrlRef.current)
      galleryObjectUrlsRef.current.forEach(URL.revokeObjectURL)
    },
    []
  )

  /* ---------------------------------------------------------------------- */
  /* THUMBNAIL UPLOAD – REAL CONVEX FLOW                                   */
  /* ---------------------------------------------------------------------- */

  const handleThumbnailFiles = useCallback(
    async (files: File[]) => {
      console.log('🔥 handleThumbnailFiles called')
      const file = files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('Please choose an image file.')
        return
      }

      try {
        setIsUploadingThumbnail(true)

        // 1) Get Convex POST upload URL
        const uploadUrl = await requestUploadUrl()
        console.log('📤 uploadUrl', uploadUrl)

        // 2) Upload file to Convex (POST)
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file
        })

        if (!res.ok) {
          console.error('Upload failed', res.status, await res.text())
          throw new Error('Upload failed')
        }

        // 3) Convex responds with storageId in JSON
        const { storageId } = (await res.json()) as { storageId?: string }
        console.log('✅ storageId', storageId)

        if (!storageId) throw new Error('Missing storageId')

        // 4) Get public URL for preview
        const { url } = await convex.query(api.media.getUrl, {
          storageId: storageId as Id<'_storage'>
        })
        console.log('🌐 media url', url)

        const resolvedUrl = url ?? URL.createObjectURL(file)
        if (!url) thumbnailObjectUrlRef.current = resolvedUrl

        // 5) Save metadata row
        await saveMedia({ storageId, url: resolvedUrl })

        // 6) Update form + UI (store storage:xxxx reference)
        setThumbnailPreview(resolvedUrl)
        form.setValue(thumbnailPath, toStorageSource(storageId) as any, {
          shouldDirty: true
        })
        setThumbnailTab('upload')

        toast.success('Thumbnail uploaded.')
      } catch (err) {
        console.error(err)
        toast.error('Thumbnail upload failed.')
      } finally {
        setIsUploadingThumbnail(false)
      }
    },
    [convex, form, requestUploadUrl, saveMedia, thumbnailPath]
  )

  const handleClearThumbnail = useCallback(() => {
    if (thumbnailObjectUrlRef.current) {
      URL.revokeObjectURL(thumbnailObjectUrlRef.current)
      thumbnailObjectUrlRef.current = null
    }
    setThumbnailPreview(null)
    form.setValue(thumbnailPath, '' as any, {
      shouldDirty: true
    })
    setThumbnailTab('link')
  }, [form, thumbnailPath])

  /* ---------------------------------------------------------------------- */
  /* GALLERY – LINK ADD (Image + YouTube)                                   */
  /* ---------------------------------------------------------------------- */

  const handleAddGalleryLink = useCallback(() => {
    const trimmed = normalizeMediaInput(galleryLinkInput)
    if (!trimmed) return toast.error('Enter a valid URL.')

    // Allow regular media refs (images, storage:xxxx, etc) OR YouTube links
    const isSupported =
      isValidMediaReference(trimmed) || isYouTubeUrl(trimmed)

    if (!isSupported) {
      return toast.error('Enter a valid image or YouTube URL.')
    }

    const curr = galleryItemsRef.current
    if (curr.length >= maxGalleryItems)
      return toast.error(`Max ${maxGalleryItems} items.`)

    const next = [
      ...curr,
      { id: generateGalleryId(trimmed), url: trimmed, source: trimmed }
    ]

    setGalleryItems(next)
    galleryItemsRef.current = next
    form.setValue(galleryPath, next.map(i => i.source) as any, {
      shouldDirty: true
    })

    setGalleryLinkInput('')
    setGalleryTab('links')
  }, [form, galleryLinkInput, galleryPath, maxGalleryItems])

  /* ---------------------------------------------------------------------- */
  /* GALLERY – UPLOAD                                                       */
  /* ---------------------------------------------------------------------- */

  const handleGalleryFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      const curr = galleryItemsRef.current

      const remaining = maxGalleryItems - curr.length
      if (remaining <= 0)
        return toast.error(`Max ${maxGalleryItems} items.`)

      const toUpload = files.slice(0, remaining)
      const uploaded: GalleryItem[] = []

      try {
        setIsUploadingGallery(true)

        for (const file of toUpload) {
          if (!file.type.startsWith('image/')) {
            toast.error(`${file.name} is not an image.`)
            continue
          }

          // 1) Upload file to Convex
          const uploadUrl = await requestUploadUrl()
          const res = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file
          })

          if (!res.ok) {
            console.error('Upload failed for', file.name, res.status)
            toast.error(`Upload failed for ${file.name}`)
            continue
          }

          const { storageId } = (await res.json()) as { storageId?: string }
          if (!storageId) continue

          const { url } = await convex.query(api.media.getUrl, {
            storageId: storageId as Id<'_storage'>
          })

          const resolvedUrl = url ?? URL.createObjectURL(file)
          if (!url) galleryObjectUrlsRef.current.push(resolvedUrl)

          await saveMedia({ storageId, url: resolvedUrl })

          uploaded.push({
            id: generateGalleryId(storageId),
            url: resolvedUrl,
            source: toStorageSource(storageId),
            storageId
          })
        }
      } catch (err) {
        console.error(err)
        toast.error('Gallery upload failed.')
      } finally {
        setIsUploadingGallery(false)
      }

      if (!uploaded.length) return

      const next = [...curr, ...uploaded]
      setGalleryItems(next)
      galleryItemsRef.current = next

      form.setValue(galleryPath, next.map(i => i.source) as any, {
        shouldDirty: true
      })

      toast.success('Gallery updated.')
    },
    [convex, form, galleryPath, maxGalleryItems, requestUploadUrl, saveMedia]
  )

  /* ---------------------------------------------------------------------- */
  /* REMOVE GALLERY ITEM                                                    */
  /* ---------------------------------------------------------------------- */

  const handleRemoveGalleryItem = useCallback(
    (id: string) => {
      const curr = galleryItemsRef.current
      const next = curr.filter(i => i.id !== id)
      if (next.length === curr.length) return

      setGalleryItems(next)
      galleryItemsRef.current = next

      form.setValue(galleryPath, next.map(i => i.source) as any, {
        shouldDirty: true
      })
    },
    [form, galleryPath]
  )

  /* ---------------------------------------------------------------------- */
  /* UI – Zipher styling preserved                                          */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* THUMBNAIL INPUT */}
      <FormField
        control={form.control}
        name={thumbnailPath}
        render={({ field }) => {
          const resolvedValue =
            typeof field.value === 'string' ? field.value : ''

          return (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>

              <Tabs
                value={thumbnailTab}
                onValueChange={v => setThumbnailTab(v as any)}
                className="space-y-3"
              >
                <TabsList className="grid w-full grid-cols-2 bg-muted/40 backdrop-blur-sm border border-border rounded-lg">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" />
                    Upload
                  </TabsTrigger>

                  <TabsTrigger value="link" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Link
                  </TabsTrigger>
                </TabsList>

                {/* Upload Tab */}
                <TabsContent value="upload">
                  <MediaDropzone
                    accept="image/*"
                    uploading={isUploadingThumbnail}
                    disabled={isUploadingThumbnail}
                    dropAreaClassName="h-44 w-full overflow-hidden rounded-lg bg-muted/40 border border-border backdrop-blur-sm"
                    onSelect={handleThumbnailFiles}
                  >
                    {thumbnailPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={String(thumbnailPreview)}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                        <span>Select or drag an image.</span>
                      </div>
                    )}
                  </MediaDropzone>

                  {thumbnailPreview && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearThumbnail}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Link Tab */}
                <TabsContent value="link">
                  <FormControl>
                    <Input
                      ref={field.ref}
                      name={field.name}
                      placeholder="https://example.com/thumbnail.jpg"
                      value={isStorageReference(resolvedValue) ? '' : resolvedValue}
                      onBlur={field.onBlur}
                      onChange={e => {
                        const v = e.target.value
                        field.onChange(v)
                        setThumbnailPreview(normalizeMediaInput(v) || null)
                      }}
                    />
                  </FormControl>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Paste a direct image URL.
                  </p>
                </TabsContent>
              </Tabs>

              <FormMessage />
            </FormItem>
          )
        }}
      />

      {/* GALLERY INPUT */}
      <FormField
        control={form.control}
        name={galleryPath}
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Gallery
              <span className="text-xs text-muted-foreground">
                {galleryItems.length}/{maxGalleryItems}
              </span>
            </FormLabel>

            <Tabs
              value={galleryTab}
              onValueChange={v => setGalleryTab(v as any)}
              className="space-y-3"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/40 backdrop-blur-sm border border-border rounded-lg">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  Upload
                </TabsTrigger>

                <TabsTrigger value="links" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Links
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload">
                <MediaDropzone
                  accept="image/*"
                  multiple
                  uploading={isUploadingGallery}
                  disabled={isUploadingGallery}
                  onSelect={handleGalleryFiles}
                  dropAreaClassName="h-36 w-full rounded-lg border border-border bg-muted/40 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <UploadCloud className="h-6 w-6" />
                    {maxGalleryItems - galleryItems.length > 0
                      ? 'Drag or upload images'
                      : 'Gallery full'}
                  </div>
                </MediaDropzone>
              </TabsContent>

              {/* Links Tab */}
              <TabsContent value="links">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      placeholder="https://example.com/image.png or https://youtu.be/..."
                      value={galleryLinkInput}
                      onChange={e => setGalleryLinkInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddGalleryLink()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddGalleryLink}
                      disabled={!galleryLinkInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste image or YouTube URLs. These appear in your media carousel.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Gallery Grid */}
            {galleryItems.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map(item => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card/40 backdrop-blur-sm"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={String(item.url)}
                        alt="Gallery preview"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div
                      className="absolute inset-x-0 bottom-0 flex justify-end p-2
                      bg-gradient-to-t from-black/60 to-transparent
                      opacity-0 group-hover:opacity-100 transition"
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveGalleryItem(item.id)}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                No gallery items yet.
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
