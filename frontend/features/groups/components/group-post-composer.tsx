'use client'

import { useState } from 'react'

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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useEthereumAccount } from '@/hooks/use-ethereum-account'

type GroupPostComposerProps = {
  groupId: Id<'groups'>
}

export function GroupPostComposer({ groupId }: GroupPostComposerProps) {
  const { address } = useEthereumAccount()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { mutate: createPost, pending } = useApiMutation(api.posts.create)

  if (!address) return null

  const canSubmit = Boolean(title.trim()) && !pending

  const handleCreate = async () => {
    if (!canSubmit) return

    await createPost({
      title: title.trim(),
      content: content.trim(),
      groupId,
      address
    })

    setTitle('')
    setContent('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="
            w-full rounded-xl border border-border/40 bg-card/60
            backdrop-blur-xl px-5 py-4 text-left text-sm text-muted-foreground
            shadow-sm transition-all hover:bg-card hover:shadow-md
            hover:text-foreground
          "
        >
          Write something…
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl bg-card/90 backdrop-blur-xl border border-border/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a Post</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share your ideas, updates or insights with your community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Post title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            className="
              bg-background/40 border-border/50
              focus-visible:ring-1 focus-visible:ring-primary
            "
          />

          <Textarea
            placeholder="What would you like to share?"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            className="
              bg-background/40 border-border/50
              focus-visible:ring-1 focus-visible:ring-primary
            "
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-muted/40"
            >
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleCreate}
              className="
                px-6 font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Publish
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
