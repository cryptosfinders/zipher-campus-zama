'use client'

import { CourseGrid } from '@/features/classroom/components/course-grid'
import { JoinGroupButton } from '@/features/groups/components/join-group-button'
import { useGroupContext } from '@/features/groups/context/group-context'

type ClassroomPageProps = {
  params: Promise<{
    groupId: string
  }>
}

export default function ClassroomPage(_: ClassroomPageProps) {
  const { group, isOwner, access } = useGroupContext()

  if (!access.classroom) {
    return (
      <div className="
        flex flex-col items-center justify-center space-y-6 
        rounded-2xl border border-primary/30 border-dashed 
        bg-primary/5 px-6 py-16 text-center shadow-sm
      ">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-xl font-semibold text-foreground">
            Join this group to access the classroom
          </h2>
          <p className="text-sm text-muted-foreground">
            Courses, modules, and lessons unlock automatically once you become a member.
          </p>
        </div>

        {/* Gold-themed join button (inherits Zipher theme globally) */}
        <JoinGroupButton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Courses list (gold theme applied globally through palette) */}
      <CourseGrid groupId={group._id} canCreate={isOwner} />
    </div>
  )
}
