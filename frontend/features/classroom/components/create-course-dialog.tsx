'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useAppRouter } from '@/hooks/use-app-router'
import { useEthereumAccount } from '@/hooks/use-ethereum-account'
import { CourseMetadataEditor } from './course/course-metadata-editor'

/* Zipher Design Tokens */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_BORDER = 'rgba(247, 201, 72, 0.45)'
const ZIPHER_BG = 'rgba(247, 201, 72, 0.06)'

type CreateCourseDialogProps = {
  groupId: Id<'groups'>
  children: React.ReactNode
}

export function CreateCourseDialog({ groupId, children }: CreateCourseDialogProps) {
  const router = useAppRouter()
  const { mutate: create, pending } = useApiMutation(api.courses.create)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const { address } = useEthereumAccount()

  const handleCreate = async () => {
    if (!address) {
      toast.error('Please connect your wallet to create a course')
      return
    }

    if (!title.trim()) {
      toast.error('Please provide a course title')
      return
    }

    try {
      const courseId = await create({
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl,
        groupId,
        address
      })

      setTitle('')
      setDescription('')
      setThumbnailUrl(undefined)
      setOpen(false)
      toast.success('Course created successfully')

      router.push(`/${groupId}/classroom/${courseId}`)
    } catch (error) {
      console.error('Failed to create course', error)
      toast.error('Unable to create course. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="
          max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl
          border shadow-xl
        "
        style={{
          borderColor: ZIPHER_BORDER,
          backgroundColor: ZIPHER_BG,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a Course
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Start building your course. Add modules and lessons after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <CourseMetadataEditor
            mode="create"
            groupId={groupId}
            title={title}
            description={description}
            thumbnailUrl={thumbnailUrl}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onThumbnailChange={setThumbnailUrl}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              type="button"
              disabled={pending}
              className="hover:bg-neutral-200/40"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={pending || !title.trim() || !address}
            className="px-6"
            style={{
              backgroundColor: ZIPHER_GOLD,
              color: '#000',
            }}
          >
            {pending ? 'Creating...' : 'Create Course'}
          </Button>
        </div>

        {!address && (
          <div
            className="mt-4 rounded-lg px-4 py-3 text-sm"
            style={{
              border: '1px solid rgba(255,0,0,0.3)',
              backgroundColor: 'rgba(255,0,0,0.05)',
              color: '#b00020',
            }}
          >
            Please connect your wallet to create a course
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
