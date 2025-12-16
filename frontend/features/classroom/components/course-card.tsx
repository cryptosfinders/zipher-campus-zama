'use client'

import Image from 'next/image'
import { BookOpen, ChevronRight } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { useAppRouter } from '@/hooks/use-app-router'
import { useResolvedMediaUrl } from '@/hooks/use-resolved-media-url'

/* Zipher Campus Color Tokens */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.45)'
const ZIPHER_GOLD_SOFT = 'rgba(247, 201, 72, 0.15)'

type CourseCardProps = {
  groupId: Id<'groups'>
  course: Doc<'courses'> & { thumbnailUrl?: string }
}

export function CourseCard({ groupId, course }: CourseCardProps) {
  const router = useAppRouter()
  const { url: thumbnailUrl, loading } = useResolvedMediaUrl(course.thumbnailUrl)

  return (
    <article
      onClick={() => router.push(`/${groupId}/classroom/${course._id}`)}
      className="
        flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl
        bg-white/70 backdrop-blur border shadow-sm
        transition-all hover:shadow-lg hover:-translate-y-[2px]
      "
      style={{
        borderColor: ZIPHER_GOLD_BORDER,
      }}
    >
      <div
        className="relative aspect-video"
        style={{
          backgroundColor: ZIPHER_GOLD_SOFT,
        }}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 360px"
          />
        ) : loading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-neutral-500" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
          {course.description || 'No description provided'}
        </p>

        {/* Progress */}
        <div className="mt-auto pt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full transition-all"
              style={{
                width: `0%`,
                backgroundColor: ZIPHER_GOLD,
              }}
            />
          </div>

          <p className="mt-2 text-xs font-semibold text-neutral-500">
            0%
          </p>
        </div>
      </div>
    </article>
  )
}
