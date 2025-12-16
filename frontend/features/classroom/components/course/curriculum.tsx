'use client'

import { useState } from 'react'

import { BookCheck, Component, Pen, Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { useGroupContext } from '@/features/groups/context/group-context'
import { useAppRouter } from '@/hooks/use-app-router'

import { LessonView } from './lesson-view'
import { cn } from '@/lib/utils'

type CurriculumProps = {
  course: Doc<'courses'> & {
    modules: Array<Doc<'modules'> & { lessons: Doc<'lessons'>[] }>
  }
  groupId: Id<'groups'>
}

export function Curriculum({ course, groupId }: CurriculumProps) {
  type ModuleWithLessons = Doc<'modules'> & { lessons: Doc<'lessons'>[] }
  type LessonDoc = Doc<'lessons'>

  const { isOwner } = useGroupContext()
  const router = useAppRouter()
  const [activeLesson, setActiveLesson] = useState<LessonDoc | null>(
    course.modules[0]?.lessons[0] ?? null
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

      {/* LEFT SIDEBAR */}
      <aside
        className="
          space-y-6 rounded-2xl border border-border 
          bg-background/40 backdrop-blur-xl 
          shadow-sm p-5
        "
      >
        {/* Course Header */}
        <div className="flex items-center gap-3">
          <BookCheck className="h-5 w-5 text-[#F7C948]" />
          <div>
            <h1 className="text-lg font-semibold">{course.title}</h1>
            <p className="text-xs text-muted-foreground">
              {course.modules.length} modules
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        {isOwner && (
          <Button
            type="button"
            variant="outline"
            className="
              w-full border-[#F7C948]/40 text-[#F7C948]
              hover:bg-[#F7C948]/10
            "
            onClick={() =>
              router.push(`/${groupId}/classroom/${course._id}/edit`)
            }
          >
            <Pen className="mr-2 h-4 w-4" /> Edit Course
          </Button>
        )}

        {/* MODULES + LESSONS */}
        <div className="space-y-6">
          {course.modules.map((module: ModuleWithLessons) => (
            <section key={module._id} className="space-y-2">

              {/* Module Title */}
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Component className="h-4 w-4 text-muted-foreground" />
                <span>{module.title}</span>
              </div>

              {/* Lessons */}
              <ul className="space-y-1">
                {module.lessons.map((lesson: LessonDoc) => {
                  const isActive = activeLesson?._id === lesson._id

                  return (
                    <li key={lesson._id}>
                      <button
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all border border-transparent",
                          isActive
                            ? "bg-[#F7C948]/15 text-[#F7C948] border-[#F7C948]/40"
                            : "hover:bg-muted"
                        )}
                      >
                        <Type className={cn(
                          "h-4 w-4",
                          isActive ? "text-[#F7C948]" : "text-muted-foreground"
                        )} />
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>

            </section>
          ))}
        </div>
      </aside>

      {/* RIGHT PANEL — Lesson Content */}
      <div
        className="
          min-h-[320px] rounded-2xl border border-border 
          bg-background/40 backdrop-blur-xl shadow-sm 
          p-6
        "
      >
        {activeLesson ? (
          <LessonView lesson={activeLesson} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a lesson to get started.
          </p>
        )}
      </div>
    </div>
  )
}
