'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { useMutation } from 'convex/react'
import { ImageIcon, Link2, Pencil, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

import { MediaDropzone } from '@/features/groups/components/media-dropzone'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useAppRouter } from '@/hooks/use-app-router'
import { useResolvedMediaUrl } from '@/hooks/use-resolved-media-url'
import { isStorageReference, toStorageSource } from '@/lib/media'

import { cn } from '@/lib/utils'

type CourseMetadataEditorProps = {
  mode: 'create' | 'edit'
  courseId?: Id<'courses'>
  groupId: Id<'groups'>
  title: string
  description: string
  thumbnailUrl?: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onThumbnailChange?: (value?: string) => void
  address?: `0x${string}`
}

export function CourseMetadataEditor({
  mode,
  courseId,
  groupId,
  title,
  description,
  thumbnailUrl = '',
  onTitleChange,
  onDescriptionChange,
  onThumbnailChange,
  address
}: CourseMetadataEditorProps) {
  const router = useAppRouter()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [thumbnailSource, setThumbnailSource] = useState(thumbnailUrl)
  const [thumbnailLinkInput, setThumbnailLinkInput] = useState(
    thumbnailUrl && !isStorageReference(thumbnailUrl) ? thumbnailUrl : ''
  )
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [thumbnailTab, setThumbnailTab] = useState(
    thumbnailUrl && !isStorageReference(thumbnailUrl) ? 'link' : 'upload'
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const generateUploadUrl = useMutation(api.media.generateUploadUrl)
  const { mutate: updateThumbnail, pending: thumbnailPending } =
    useApiMutation(api.courses.updateThumbnail)
  const { mutate: deleteCourse, pending: deletePending } =
    useApiMutation(api.courses.remove)

  const { url: thumbnailPreviewUrl, loading: thumbnailPreviewLoading } =
    useResolvedMediaUrl(thumbnailSource || thumbnailUrl)

  const canRemoveThumbnail = useMemo(
    () => Boolean(thumbnailSource || thumbnailLinkInput.trim()),
    [thumbnailSource, thumbnailLinkInput]
  )

  const applyThumbnailSource = next => {
    const resolved = next ?? ''
    const isLinkSource = Boolean(resolved) && !isStorageReference(resolved)
    setThumbnailSource(resolved)
    setThumbnailLinkInput(isLinkSource ? resolved : '')
    setThumbnailTab(isLinkSource ? 'link' : 'upload')
  }

  const handleThumbnailFiles = async files => {
    const file = files[0]
    if (!file || thumbnailPending || isUploadingThumbnail) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }

    const prev = thumbnailSource
    try {
      setIsUploadingThumbnail(true)
      const { uploadUrl } = await generateUploadUrl({})

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file
      })

      if (!response.ok) throw new Error('Upload failed')

      const payload = await response.json()
      const storageId = payload.storageId
      if (!storageId) throw new Error('Missing storage id')

      const src = toStorageSource(storageId)

      if (mode === 'edit' && courseId && address && onThumbnailChange) {
        await updateThumbnail({ id: courseId, thumbnailUrl: src, address })
      }

      applyThumbnailSource(src)
      onThumbnailChange?.(src)
      toast.success('Course thumbnail updated.')
    } catch (err) {
      console.error(err)
      applyThumbnailSource(prev)
      toast.error('Unable to upload image.')
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleThumbnailLinkCommit = async () => {
    const trimmed = thumbnailLinkInput.trim()
    const previous = thumbnailSource

    if (!trimmed) {
      if (!previous) return
      if (mode === 'edit' && courseId && address && onThumbnailChange) {
        try {
          await updateThumbnail({ id: courseId, thumbnailUrl: undefined, address })
          applyThumbnailSource('')
          onThumbnailChange?.(undefined)
          toast.success('Removed thumbnail.')
        } catch (err) {
          console.error(err)
          applyThumbnailSource(previous)
          toast.error('Failed to remove thumbnail.')
        }
      } else {
        applyThumbnailSource('')
        onThumbnailChange?.(undefined)
      }
      return
    }

    try {
      const url = new URL(trimmed)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      toast.error('Invalid image URL.')
      return
    }

    if (mode === 'edit' && courseId && address && onThumbnailChange) {
      try {
        await updateThumbnail({ id: courseId, thumbnailUrl: trimmed, address })
        applyThumbnailSource(trimmed)
        onThumbnailChange?.(trimmed)
        toast.success('Thumbnail updated.')
      } catch (err) {
        console.error(err)
        applyThumbnailSource(previous)
        toast.error('Could not update thumbnail.')
      }
    } else {
      applyThumbnailSource(trimmed)
      onThumbnailChange?.(trimmed)
    }
  }

  const handleClearThumbnail = async () => {
    if (!thumbnailSource) {
      setThumbnailLinkInput('')
      applyThumbnailSource('')
      return
    }

    const prev = thumbnailSource
    if (mode === 'edit' && courseId && address && onThumbnailChange) {
      try {
        await updateThumbnail({ id: courseId, thumbnailUrl: undefined, address })
        applyThumbnailSource('')
        setThumbnailLinkInput('')
        onThumbnailChange?.(undefined)
        toast.success('Thumbnail removed.')
      } catch (err) {
        console.error(err)
        applyThumbnailSource(prev)
        toast.error('Unable to clear thumbnail.')
      }
    } else {
      applyThumbnailSource('')
      setThumbnailLinkInput('')
      onThumbnailChange?.(undefined)
    }
  }

  const handleSaveMetadata = () => {
    onTitleChange(editTitle)
    onDescriptionChange(editDescription)
    setDialogOpen(false)
    toast.success('Course metadata updated.')
  }

  const handleDeleteCourse = async () => {
    if (mode !== 'edit') return
    if (!courseId) return toast.error('Missing course ID.')
    if (!address) return toast.error('Connect wallet first.')
    if (!groupId) return toast.error('Missing group ID.')

    try {
      await deleteCourse({ courseId, address })
      toast.success('Course deleted.')
      setDeleteDialogOpen(false)
      setDialogOpen(false)
      router.push(`/${groupId}/classroom`)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Unable to delete course.')
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               ZIPHER CAMPUS UI                              */
  /* -------------------------------------------------------------------------- */

  if (mode === 'create') {
    return (
      <div className="space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Course Title
          </label>
          <Input
            placeholder="e.g., Introduction to Web Development"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            className="h-12 border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
          />
          <p className="text-xs text-muted-foreground">
            Give your course a short, accurate name.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Course Description
          </label>
          <Textarea
            placeholder="Describe what learners will gain..."
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            className="min-h-[120px] resize-none border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
          />
          <p className="text-xs text-muted-foreground">
            Explain the key learning outcomes.
          </p>
        </div>

        {/* Thumbnail */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">
            Course Thumbnail
          </label>

          <Tabs
            value={thumbnailTab}
            onValueChange={v => setThumbnailTab(v)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-background/40 border border-border rounded-xl">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 data-[state=active]:text-[#F7C948] data-[state=active]:border-b-2 data-[state=active]:border-[#F7C948]"
              >
                <UploadCloud className="h-4 w-4" />
                Upload
              </TabsTrigger>

              <TabsTrigger
                value="link"
                className="flex items-center gap-2 data-[state=active]:text-[#F7C948] data-[state=active]:border-b-2 data-[state=active]:border-[#F7C948]"
              >
                <Link2 className="h-4 w-4" />
                Link
              </TabsTrigger>
            </TabsList>

            {/* Upload */}
            <TabsContent value="upload" className="pt-3">
              <MediaDropzone
                accept="image/*"
                onSelect={handleThumbnailFiles}
                disabled={thumbnailPending || isUploadingThumbnail}
                uploading={isUploadingThumbnail}
                dropAreaClassName="min-h-[200px] p-4 border-[#F7C948]/40"
              >
                {thumbnailPreviewLoading ? (
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                ) : thumbnailPreviewUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={thumbnailPreviewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                    <span>Click or drag an image here.</span>
                  </div>
                )}
              </MediaDropzone>

              {canRemoveThumbnail && (
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    className="text-[#F7C948]"
                    onClick={handleClearThumbnail}
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Link */}
            <TabsContent value="link" className="pt-3">
              <Input
                placeholder="https://example.com/image.jpg"
                value={thumbnailLinkInput}
                onChange={e => setThumbnailLinkInput(e.target.value)}
                onBlur={handleThumbnailLinkCommit}
                disabled={thumbnailPending || isUploadingThumbnail}
                className="border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                              EDIT MODE (DIALOG)                             */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-4 rounded-xl p-4 bg-background/40 border border-border shadow-sm backdrop-blur-md">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description || 'No description provided'}
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[#F7C948]/50 text-[#F7C948]"
              onClick={() => {
                setEditTitle(title)
                setEditDescription(description)
              }}
              size="sm"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#F7C948]/30 bg-background/60 backdrop-blur-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update your course information.
              </DialogDescription>
            </DialogHeader>

            {/* MAIN EDIT FORM */}

            <div className="space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Course Title</label>
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea
                  rows={4}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Course Thumbnail</label>

                <Tabs
                  value={thumbnailTab}
                  onValueChange={v => setThumbnailTab(v)}
                >
                  <TabsList className="grid grid-cols-2 bg-background/40 border rounded-xl">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="pt-3">
                    <MediaDropzone
                      accept="image/*"
                      onSelect={handleThumbnailFiles}
                      disabled={thumbnailPending || isUploadingThumbnail}
                      uploading={isUploadingThumbnail}
                      dropAreaClassName="min-h-[200px] p-4 border-[#F7C948]/40"
                    >
                      {thumbnailPreviewLoading ? (
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                      ) : thumbnailPreviewUrl ? (
                        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={thumbnailPreviewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <UploadCloud className="h-6 w-6" />
                          <span>Upload a new thumbnail</span>
                        </div>
                      )}
                    </MediaDropzone>

                    {canRemoveThumbnail && (
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          className="text-red-500"
                          onClick={handleClearThumbnail}
                          size="sm"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="link" className="pt-3">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={thumbnailLinkInput}
                      onChange={e => setThumbnailLinkInput(e.target.value)}
                      onBlur={handleThumbnailLinkCommit}
                      className="border-[#F7C948]/40 focus-visible:ring-[#F7C948]"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-between items-center pt-6 border-t mt-6">
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deletePending}
                  >
                    Delete Course
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete this course?</DialogTitle>
                    <DialogDescription>
                      This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="gap-3">
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>

                    <Button
                      variant="destructive"
                      onClick={handleDeleteCourse}
                      disabled={deletePending}
                    >
                      {deletePending ? 'Deleting…' : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>

                <Button
                  onClick={handleSaveMetadata}
                  disabled={!editTitle.trim()}
                  className="bg-[#F7C948] text-black hover:bg-[#eebc3c]"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
