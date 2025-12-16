'use client'

import { useEffect, useMemo, useState } from 'react'

import { useAppRouter } from '@/hooks/use-app-router'

import { Button } from '@/components/ui/button'
import { GroupDescriptionEditor } from '@/features/groups/components/group-description-editor'
import { GroupNameEditor } from '@/features/groups/components/group-name-editor'
import { GroupSettingsForm } from '@/features/groups/components/group-settings-form'
import { useGroupContext } from '@/features/groups/context/group-context'

import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { extractStorageId, isStorageReference } from '@/lib/media'

type GroupEditPageProps = {
  params: Promise<{
    groupId: string
  }>
}

export default function GroupEditPage(_props: GroupEditPageProps) {
  const router = useAppRouter()
  const convex = useConvex()

  const { group, isOwner } = useGroupContext()

  /* ==========================================================================
     👇 PATCH: Resolve thumbnail + aboutUrl + gallery so form receives REAL URLs
     ========================================================================= */

  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(null)
  const [resolvedAboutUrl, setResolvedAboutUrl] = useState<string | null>(null)
  const [resolvedGallery, setResolvedGallery] = useState<string[]>([])

  useEffect(() => {
    async function resolveMedia() {
      /* --- THUMBNAIL --- */
      if (group.thumbnailUrl) {
        if (isStorageReference(group.thumbnailUrl)) {
          const id = extractStorageId(group.thumbnailUrl)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          setResolvedThumbnail(url ?? null)
        } else {
          setResolvedThumbnail(group.thumbnailUrl)
        }
      } else {
        setResolvedThumbnail(null)
      }

      /* --- ABOUT URL --- */
      if (group.aboutUrl) {
        if (isStorageReference(group.aboutUrl)) {
          const id = extractStorageId(group.aboutUrl)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          setResolvedAboutUrl(url ?? null)
        } else {
          setResolvedAboutUrl(group.aboutUrl)
        }
      } else {
        setResolvedAboutUrl(null)
      }

      /* --- GALLERY --- */
      const resolved: string[] = []
      for (const img of group.galleryUrls ?? []) {
        if (isStorageReference(img)) {
          const id = extractStorageId(img)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          if (url) resolved.push(url)
        } else {
          resolved.push(img)
        }
      }
      setResolvedGallery(resolved)
    }

    resolveMedia()
  }, [convex, group.thumbnailUrl, group.aboutUrl, group.galleryUrls])

  /* ==========================================================================
     🔐 Owner check
     ========================================================================= */
  useEffect(() => {
    if (!isOwner) {
      router.replace(`/${group._id}`)
    }
  }, [group._id, isOwner, router])

  if (!isOwner) return null

  /* ==========================================================================
     👇 COMPOSE INITIAL MEDIA FOR GroupSettingsForm
     ========================================================================= */

  const initialMedia = useMemo(
    () => ({
      thumbnailUrl: resolvedThumbnail,
      thumbnailSource: group.thumbnailUrl ?? null,
      aboutUrl: resolvedAboutUrl,
      gallery: (group.galleryUrls ?? []).map((src, i) => ({
        url: resolvedGallery[i] ?? src,
        source: src,
      })),
    }),
    [resolvedThumbnail, resolvedAboutUrl, resolvedGallery, group.galleryUrls, group.thumbnailUrl]
  )

  /* ==========================================================================
     RENDER UI (unchanged)
     ========================================================================= */
  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* Group Name Editor */}
      <div
        className="
          rounded-2xl border border-primary/30
          bg-primary/5 p-6 shadow-sm shadow-primary/5
          backdrop-blur-sm transition
        "
      >
        <GroupNameEditor groupId={group._id} name={group.name} />
      </div>

      {/* Settings + Media */}
      <div
        className="
          rounded-2xl border border-primary/30
          bg-primary/5 p-6 shadow-sm shadow-primary/5
          backdrop-blur-sm transition
        "
      >
        <GroupSettingsForm group={group} initialMedia={initialMedia} />
      </div>

      {/* Description */}
      <div
        className="
          rounded-2xl border border-primary/30
          bg-primary/5 p-6 shadow-sm shadow-primary/5
          backdrop-blur-sm transition
        "
      >
        <GroupDescriptionEditor
          editable
          groupId={group._id}
          initialContent={group.description}
        />
      </div>

      {/* View Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="
            bg-gradient-to-r from-primary to-accent
            text-primary-foreground shadow-lg shadow-primary/20
            hover:opacity-90 transition
          "
          onClick={() => router.push(`/${group._id}/about`)}
        >
          View Live Group
        </Button>
      </div>

    </div>
  )
}
