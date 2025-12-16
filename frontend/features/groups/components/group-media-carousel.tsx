'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { PlayCircle } from 'lucide-react'

import {
  normalizeYouTubeEmbedUrl,
  isStorageReference,
  extractStorageId
} from '@/lib/media'
import { cn } from '@/lib/utils'

import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'

/* ---------------------------------------------------------
 * EXTENDED MEDIA TYPES
 * --------------------------------------------------------- */
type MediaKind =
  | 'image'
  | 'video'
  | 'youtube'
  | 'vimeo'
  | 'tiktok'

type MediaItem = {
  url: string
  kind: MediaKind
  /** For thumbnails (YouTube, Vimeo) */
  thumbnail?: string
  /** For iframes */
  embedUrl?: string
}

type GroupMediaCarouselProps = {
  sources: string[]
  fallbackImage?: string | null
}

/* ---------------------------------------------------------
 * HELPERS
 * --------------------------------------------------------- */

/** Extract YouTube Video ID */
function parseYouTubeId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return id
      const segments = parsed.pathname.split('/')
      return segments.pop() || null
    }
    if (parsed.hostname.includes('youtu.be')) {
      const segments = parsed.pathname.split('/')
      return segments.pop() || null
    }
  } catch {}
  return null
}

/** Extract Vimeo Video ID */
function parseVimeoId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('vimeo.com')) {
      const segments = parsed.pathname.split('/')
      const last = segments.pop()
      return last && /^\d+$/.test(last) ? last : null
    }
  } catch {}
  return null
}

/** Extract TikTok ID */
function parseTikTokId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('tiktok.com')) {
      const parts = parsed.pathname.split('/')
      const idx = parts.indexOf('video')
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {}
  return null
}

/* ---------------------------------------------------------
 * DETECT MEDIA KIND  — PATCHED
 * --------------------------------------------------------- */
function detectMediaKind(url: string): MediaItem | null {
  const lower = url.toLowerCase()

  /* ---------- YOUTUBE ---------- */
  if (lower.includes('youtu')) {
    const id = parseYouTubeId(url)
    if (!id) return null

    return {
      url,
      kind: 'youtube',
      thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`,
      embedUrl:
        normalizeYouTubeEmbedUrl(url) ??
        `https://www.youtube.com/embed/${id}?rel=0`
    }
  }

  /* ---------- VIMEO ---------- */
  if (lower.includes('vimeo.com')) {
    const id = parseVimeoId(url)
    if (!id) return null

    return {
      url,
      kind: 'vimeo',
      thumbnail: `https://vumbnail.com/${id}.jpg`,
      embedUrl: `https://player.vimeo.com/video/${id}`
    }
  }

  /* ---------- TIKTOK ---------- */
  if (lower.includes('tiktok.com')) {
    const id = parseTikTokId(url)
    if (!id) return null

    return {
      url,
      kind: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/${id}`
    }
  }

  /* ---------- VIDEO FILES ---------- */
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.ogg']
  if (videoExtensions.some(ext => lower.endsWith(ext))) {
    return { url, kind: 'video' }
  }

  /* ---------- DEFAULT → IMAGE ---------- */
  return { url, kind: 'image' }
}

/* ---------------------------------------------------------
 * COMPONENT
 * --------------------------------------------------------- */

export function GroupMediaCarousel({
  sources,
  fallbackImage
}: GroupMediaCarouselProps) {
  const convex = useConvex()

  /* ---------------------------------------------------------
   * STEP 1 — Resolve storage:xxxx → real URL
   * --------------------------------------------------------- */
  const [resolvedSources, setResolvedSources] = useState<string[]>([])

  useEffect(() => {
    async function resolveAll() {
      const result: string[] = []

      for (const src of sources ?? []) {
        if (isStorageReference(src)) {
          const storageId = extractStorageId(src)
          if (storageId) {
            try {
              const { url } = await convex.query(api.media.getUrl, {
                storageId
              })
              if (url) {
                result.push(url)
                continue
              }
            } catch (err) {
              console.error('Failed to resolve storage ref:', src, err)
            }
          }
        }
        result.push(src)
      }

      if (fallbackImage) result.push(fallbackImage)

      setResolvedSources(result)
    }

    resolveAll()
  }, [sources, fallbackImage, convex])

  /* ---------------------------------------------------------
   * STEP 2 — Detect media types
   * --------------------------------------------------------- */
  const mediaItems = useMemo(() => {
    const items: MediaItem[] = []
    const seen = new Set<string>()

    for (const src of resolvedSources ?? []) {
      const parsed = detectMediaKind(src)
      if (parsed && !seen.has(parsed.url)) {
        items.push(parsed)
        seen.add(parsed.url)
      }
    }

    return items
  }, [resolvedSources])

  const [activeIndex, setActiveIndex] = useState(0)
  const active = mediaItems[activeIndex]

  /* ---------------------------------------------------------
   * EMPTY STATE
   * --------------------------------------------------------- */
  if (!active) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center
        rounded-xl border border-border bg-muted/50 backdrop-blur-sm
        text-sm text-muted-foreground">
        <PlayCircle className="mb-2 h-7 w-7 text-muted-foreground/70" />
        No media available for this community yet.
      </div>
    )
  }

  /* ---------------------------------------------------------
   * MAIN RENDER
   * --------------------------------------------------------- */
  return (
    <div className="space-y-4">

      {/* Main Media Display */}
      <div className="overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm">

        {/* IMAGE */}
        {active.kind === 'image' && (
          <div className="relative aspect-video w-full">
            <Image
              src={active.url}
              alt="Group media"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 720px"
            />
          </div>
        )}

        {/* YOUTUBE */}
        {active.kind === 'youtube' && active.embedUrl && (
          <iframe
            src={active.embedUrl}
            className="aspect-video w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* VIMEO */}
        {active.kind === 'vimeo' && active.embedUrl && (
          <iframe
            src={active.embedUrl}
            className="aspect-video w-full h-full"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* TIKTOK */}
        {active.kind === 'tiktok' && active.embedUrl && (
          <iframe
            src={active.embedUrl}
            className="aspect-video w-full h-full"
            allowFullScreen
          />
        )}

        {/* VIDEO FILE */}
        {active.kind === 'video' && (
          <video
            src={active.url}
            controls
            className="aspect-video w-full h-full bg-black"
          />
        )}
      </div>

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {mediaItems.map((item, index) => {
            const selected = index === activeIndex

            return (
              <button
                type="button"
                key={`${item.url}-${index}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border bg-card/70 backdrop-blur-sm",
                  selected
                    ? "border-primary ring-2 ring-primary/60 shadow-md"
                    : "border-border opacity-75 hover:opacity-100"
                )}
              >
                {/* Image thumbnails */}
                {item.kind === 'image' && (
                  <Image
                    src={item.url}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                )}

                {/* Non-image thumbnails */}
                {item.kind !== 'image' && (
                  <>
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt="Video thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
