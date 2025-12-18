'use client'
export const dynamic = 'force-dynamic'

import nextDynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

import { useAppRouter } from '@/hooks/use-app-router'
import { Button } from '@/components/ui/button'
import { GroupNameEditor } from '@/features/groups/components/group-name-editor'
import { GroupSettingsForm } from '@/features/groups/components/group-settings-form'
import { useGroupContext } from '@/features/groups/context/group-context'

import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { extractStorageId, isStorageReference } from '@/lib/media'

/* ============================================================
   🚨 CRITICAL FIX: Lazy-load BlockNote editor (NO SSR)
   ============================================================ */
const GroupDescriptionEditor = nextDynamic(
  () =>
    import('@/features/groups/components/group-description-editor').then(
      (m) => m.GroupDescriptionEditor
    ),
  { ssr: false }
)

type GroupEditPageProps = {
  params: Promise<{
    groupId: string
  }>
}

export default function GroupEditPage(_props: GroupEditPageProps) {
  const router = useAppRouter()
  const convex = useConvex()
  const { group, isOwner } = useGroupContext()

  /* ============================================================
     📦 Resolved media state
     ============================================================ */
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(null)
  const [resolvedAboutUrl, setResolvedAboutUrl] = useState<string | null>(null)
  const [resolvedGallery, setResolvedGallery] = useState<string[]>([])

  /* ============================================================
     🛡️ SAFE media resolver (NO timeouts, NO leaks)
     ============================================================ */
  useEffect(() => {
    if (!group?._id) return

    let cancelled = false

    async function resolveMedia() {
      try {
        /* --- THUMBNAIL --- */
        if (group.thumbnailUrl) {
          if (isStorageReference(group.thumbnailUrl)) {
            const id = extractStorageId(group.thumbnailUrl)
            const { url } = await convex.query(api.media.getUrl, { storageId: id })
            if (!cancelled) setResolvedThumbnail(url ?? null)
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
            if (!cancelled) setResolvedAboutUrl(url ?? null)
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

        if (!cancelled) setResolvedGallery(resolved)
      } catch (err) {
        console.error('Media resolution failed', err)
      }
    }

    resolveMedia()

    return () => {
      cancelled = true
    }
  }, [group?._id])

  /* ============================================================
     🔐 Ownership guard
     ============================================================ */
  useEffect(() => {
    if (group?._id && !isOwner) {
      router.replace(`/${group._id}`)
    }
  }, [group?._id, isOwner, router])

  if (!group || !isOwner) return null

  /* ============================================================
     🧩 Initial media for form
     ============================================================ */
  const initialMedia = useMemo(
    () => ({
      thumbnailUrl: resolvedThumbnail,
      thumbnailSource: group.thumbnailUrl ?? null,
      aboutUrl: resolvedAboutUrl,
      gallery: (group.galleryUrls ?? []).map((src, i) => ({
        url: resolvedGallery[i] ?? src,
        source: src
      }))
    }),
    [
      resolvedThumbnail,
      resolvedAboutUrl,
      resolvedGallery,
      group.thumbnailUrl,
      group.galleryUrls
    ]
  )

  /* ============================================================
     🎨 Render
     ============================================================ */
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Group Name */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
        <GroupNameEditor groupId={group._id} name={group.name} />
      </div>

      {/* Settings */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
        <GroupSettingsForm group={group} initialMedia={initialMedia} />
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
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
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
          onClick={() => router.push(`/${group._id}/about`)}
        >
          View Live Group
        </Button>
      </div>
    </div>
  )
}
