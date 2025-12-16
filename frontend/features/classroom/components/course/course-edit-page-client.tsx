'use client'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from 'convex/react'
import { CaseSensitive, Component, Fullscreen, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'

import { LessonEditorView } from '@/features/classroom/components/course/lesson-editor-view'
import { ModuleNameEditor } from '@/features/classroom/components/course/module-name-editor'
import { CourseMetadataEditor } from '@/features/classroom/components/course/course-metadata-editor'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useAppRouter } from '@/hooks/use-app-router'
import { cn } from '@/lib/utils'

/* Zipher Tokens */
const GOLD = '#F7C948'
const GOLD_BORDER = 'rgba(247, 201, 72, 0.45)'
const GOLD_BG = 'rgba(247, 201, 72, 0.08)'

type CourseEditPageClientProps = {
  groupId: Id<'groups'>
  courseId: Id<'courses'>
}

export function CourseEditPageClient({ groupId, courseId }: CourseEditPageClientProps) {
  type CourseWithRelations = Doc<'courses'> & {
    modules: Array<Doc<'modules'> & { lessons: Doc<'lessons'>[] }>
  }

  const course = useQuery(api.courses.get, { id: courseId }) as CourseWithRelations | null | undefined
  const { currentUser, address } = useCurrentUser()
  const group = useQuery(api.groups.get, { id: groupId })
  const router = useAppRouter()

  const updateTitle = useMutation(api.courses.updateTitle)
  const updateDescription = useMutation(api.courses.updateDescription)

  const addLesson = useMutation(api.lessons.add)
  const addModule = useMutation(api.modules.add)
  const removeLesson = useMutation(api.lessons.remove)
  const removeModule = useMutation(api.modules.remove)

  const [selectedLesson, setSelectedLesson] = useState<Doc<'lessons'> | null>(null)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState<string | undefined>(undefined)

  /* Sync incoming course data */
  useEffect(() => {
    if (!course) return
    setCourseTitle(course.title ?? '')
    setCourseDescription(course.description ?? '')
    setCourseThumbnailUrl(course.thumbnailUrl)
  }, [course?._id])

  /* Keep selected lesson valid */
  useEffect(() => {
    if (!course || !selectedLesson) return
    const exists = course.modules.some(m => m.lessons.some(l => l._id === selectedLesson._id))
    if (!exists) setSelectedLesson(null)
  }, [course, selectedLesson])

  /* Auto-select first lesson */
  useEffect(() => {
    if (!course || selectedLesson) return
    const first = course.modules.find(m => m.lessons.length > 0)
    if (first) setSelectedLesson(first.lessons[0])
  }, [course?.modules, selectedLesson])

  if (course === undefined) return <LoadingIndicator fullScreen />
  if (course === null) return <EmptyMessage label="Course not found." />

  const isOwner = currentUser?._id === group?.ownerId
  if (!isOwner) return <EmptyMessage label="Unauthorized" />

  const handleEditClick = () => router.push(`/${groupId}/classroom/${course._id}`)

  const handleTitleChange = async (v: string) => {
    if (!address) return
    try {
      await updateTitle({ id: course._id, title: v, address })
      setCourseTitle(v)
    } catch {
      toast.error('Unable to update title.')
    }
  }

  const handleDescriptionChange = async (v: string) => {
    if (!address) return
    try {
      await updateDescription({ id: course._id, description: v, address })
      setCourseDescription(v)
    } catch {
      toast.error('Unable to update description.')
    }
  }

  const handleAddLesson = (moduleId: Id<'modules'>) => address && addLesson({ moduleId, address })
  const handleAddModule = () => address && addModule({ courseId, address })

  return (
    <div className="flex h-full w-full flex-col gap-5 p-6">

      {/* ---- COURSE HEADER ----- */}
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{ borderColor: GOLD_BORDER, backgroundColor: GOLD_BG }}
      >
        <CourseMetadataEditor
          mode="edit"
          courseId={course._id}
          groupId={groupId}
          title={courseTitle}
          description={courseDescription}
          thumbnailUrl={courseThumbnailUrl}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onThumbnailChange={setCourseThumbnailUrl}
          address={address as `0x${string}` | undefined}
        />
      </div>

      <div className="flex h-full w-full gap-6 md:flex-row flex-col">

        {/* ---- LEFT SIDEBAR ----- */}
        <div
          className="md:w-1/4 w-full rounded-xl border p-4 space-y-6 shadow-lg"
          style={{ borderColor: GOLD_BORDER }}
        >
          <Button
            onClick={handleEditClick}
            className="flex w-full items-center gap-2"
            style={{ backgroundColor: GOLD, color: '#000' }}
          >
            <Fullscreen className="h-4 w-4" />
            Preview Course
          </Button>

          {course.modules.map(module => (
            <div key={module._id} className="space-y-3">
              <div
                className="flex items-center gap-3 rounded-lg px-3 py-2 border"
                style={{ borderColor: GOLD_BORDER }}
              >
                <Component className="h-5 w-5 text-neutral-500" />

                <div className="flex-1">
                  <ModuleNameEditor
                    id={module._id}
                    name={module.title}
                    ownerAddress={address}
                  />
                </div>

                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-red-500/10"
                  onClick={() => address && removeModule({ moduleId: module._id, address })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <ul className="space-y-1">
                {module.lessons.map(lesson => {
                  const selected = selectedLesson?._id === lesson._id
                  return (
                    <li
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition',
                        selected
                          ? 'bg-amber-200/30 border border-amber-500/40'
                          : 'hover:bg-neutral-800/40'
                      )}
                      style={selected ? { borderColor: GOLD_BORDER } : {}}
                    >
                      <CaseSensitive
                        className={cn(
                          'h-4 w-4',
                          selected ? 'text-amber-500' : 'text-neutral-500'
                        )}
                      />

                      <p
                        className={cn(
                          'flex-1 text-sm font-medium',
                          selected ? 'text-amber-500' : 'text-neutral-200'
                        )}
                      >
                        {lesson.title}
                      </p>

                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-red-500/10"
                        onClick={e => {
                          e.stopPropagation()
                          if (!address) return
                          removeLesson({ lessonId: lesson._id, address })
                          if (selectedLesson?._id === lesson._id) setSelectedLesson(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  )
                })}
              </ul>

              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 text-neutral-300 hover:bg-neutral-800"
                onClick={() => handleAddLesson(module._id)}
              >
                <Plus className="h-4 w-4 text-amber-500" />
                Add Lesson
              </Button>
            </div>
          ))}

          <Button
            onClick={handleAddModule}
            className="flex w-full items-center gap-2"
            style={{ borderColor: GOLD_BORDER, borderWidth: 1 }}
          >
            <Plus className="h-4 w-4 text-amber-500" />
            Add Module
          </Button>
        </div>

        {/* ---- RIGHT MAIN PANEL ----- */}
        <div
          className="flex-grow rounded-xl border shadow-xl p-6"
          style={{ borderColor: GOLD_BORDER, backgroundColor: GOLD_BG }}
        >
          {selectedLesson ? (
            <LessonEditorView lesson={selectedLesson} />
          ) : (
            <div className="flex h-[240px] flex-col items-center justify-center text-neutral-400 text-sm">
              Select a lesson to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Simple message block */
function EmptyMessage({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-neutral-500">{label}</div>
  )
}
