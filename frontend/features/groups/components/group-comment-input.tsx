'use client'

import { useState } from 'react'

import { Send } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useCurrentUser } from '@/hooks/use-current-user'

type GroupCommentInputProps = {
  postId: Id<'posts'>
}

export function GroupCommentInput({ postId }: GroupCommentInputProps) {
  const { currentUser } = useCurrentUser()
  const [value, setValue] = useState('')
  const { mutate, pending } = useApiMutation(api.comments.add)

  const canSubmit = Boolean(value.trim()) && !!currentUser && !pending

  const displayName =
    currentUser?.displayName?.trim() ||
    (currentUser?.walletAddress
    ? `${currentUser.walletAddress.slice(0, 6)}...${currentUser.walletAddress.slice(-4)}`
    : 'User')

  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const submitComment = async () => {
    if (!canSubmit) return
    await mutate({ postId, content: value.trim() })
    setValue('')
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-9 w-9 shrink-0">
        {currentUser?.avatarUrl ? (
          <AvatarImage src={currentUser.avatarUrl} alt={displayName} />
        ) : null}
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Write a comment..."
          value={value}
          disabled={pending || !currentUser}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submitComment()
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          size="icon"
          disabled={!canSubmit}
          onClick={submitComment}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
