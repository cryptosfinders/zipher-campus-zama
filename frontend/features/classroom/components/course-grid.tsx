'use client'

import { useQuery } from 'convex/react'
import { Plus } from 'lucide-react'

import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'

import { CourseCard } from './course-card'
import { CreateCourseDialog } from './create-course-dialog'

/* Zipher brand tokens */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.45)'
const ZIPHER_SOFT_BG = 'rgba(247, 201, 72, 0.10)'

type CourseGridProps = {
  groupId: Id<'groups'>
  canCreate?: boolean
}

export function CourseGrid({ groupId, canCreate = false }: CourseGridProps) {
  type CourseDoc = Doc<'courses'> & { thumbnailUrl?: string }

  const courses = useQuery(api.courses.list, { groupId }) as
    | CourseDoc[]
    | undefined

  if (courses === undefined) {
    return <LoadingIndicator fullScreen />
  }

  if (!courses.length && !canCreate) {
    return (
      <p className="text-sm text-neutral-500">
        The classroom is empty for now. Check back soon!
      </p>
    )
  }

  return (
    <div
      className="
        grid gap-6
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {canCreate && (
        <CreateCourseDialog groupId={groupId}>
          <button
            type="button"
            className="
              flex h-full min-h-[280px] flex-col items-center justify-center
              rounded-2xl border border-dashed bg-white/60 backdrop-blur
              transition-all hover:shadow-md hover:-translate-y-[2px]
            "
            style={{
              borderColor: ZIPHER_GOLD_BORDER,
            }}
          >
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-full border
                mb-3
              "
              style={{
                borderColor: ZIPHER_GOLD_BORDER,
                backgroundColor: ZIPHER_SOFT_BG,
              }}
            >
              <Plus className="h-8 w-8 text-gray-700" />
            </div>

            <span className="mt-1 text-base font-semibold text-gray-900">
              Create a course
            </span>
            <span className="text-xs text-neutral-500 mt-1">
              Build modules, lessons & more
            </span>
          </button>
        </CreateCourseDialog>
      )}

      {courses.map(course => (
        <CourseCard key={course._id} groupId={groupId} course={course} />
      ))}
    </div>
  )
}
