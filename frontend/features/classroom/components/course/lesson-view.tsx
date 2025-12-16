'use client'

import { CaseSensitive, Text } from 'lucide-react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Doc } from '@/convex/_generated/dataModel'
import { normalizeYouTubeEmbedUrl } from '@/lib/media'
import { cn } from '@/lib/utils'

interface LessonViewProps {
  lesson: Doc<'lessons'>
}

export const LessonView = ({ lesson }: LessonViewProps) => {
  const embedUrl = normalizeYouTubeEmbedUrl(lesson.youtubeUrl)

  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl border border-border',
        'bg-background/40 backdrop-blur-xl p-6 shadow-sm'
      )}
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <CaseSensitive className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold capitalize text-foreground">
          {lesson.title}
        </h1>
      </div>

      {/* Video */}
      <AspectRatio ratio={16 / 9}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            className="rounded-lg border border-border"
            title="Lesson video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div
            className="
              flex h-full w-full items-center justify-center
              rounded-xl bg-muted/40 border border-dashed border-border
              text-sm text-muted-foreground
            "
          >
            Video preview unavailable.
          </div>
        )}
      </AspectRatio>

      {/* Description */}
      <div className="flex items-start gap-3 pt-2">
        <Text className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-foreground">
          {lesson.description || 'No description provided.'}
        </p>
      </div>
    </div>
  )
}
