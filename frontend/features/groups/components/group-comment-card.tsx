'use client'

import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'

import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useGroupContext } from '@/features/groups/context/group-context'
import { cn } from '@/lib/utils'

type GroupCommentCardProps = {
  comment: Doc<'comments'> & { author: Doc<'users'> }
}

export function GroupCommentCard({ comment }: GroupCommentCardProps) {
  const { currentUser } = useCurrentUser()
  const { owner, administrators } = useGroupContext()

  const { mutate: removeComment, pending: isRemoving } = useApiMutation(
    api.comments.remove
  )

  // Permission: comment author OR group administration
  const isAuthor = currentUser?._id === comment.authorId
  const isGroupOwner = owner?._id === comment.author._id
  const isGroupAdmin = administrators.some(
    admin => admin.user._id === comment.author._id
  )

  const timestamp = formatDistanceToNow(comment._creationTime, {
    addSuffix: true
  })

  const authorLabel =
    comment.author.displayName?.trim() ||
    comment.author.email?.split('@')[0] ||
    'Unknown'

  const initials = authorLabel
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleRemove = () => {
    if (!currentUser || isRemoving) return
    removeComment({ id: comment._id })
  }

  return (
    <div className="group relative flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0">
        {comment.author.avatarUrl ? (
          <AvatarImage src={comment.author.avatarUrl} alt={authorLabel} />
        ) : null}

        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {authorLabel}
          </span>

          {/* Owner */}
          {isGroupOwner && (
            <Badge
              variant="default"
              className="h-5 px-2 text-[10px] font-semibold"
            >
              Owner
            </Badge>
          )}

          {/* Admin */}
          {!isGroupOwner && isGroupAdmin && (
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10px] font-semibold"
            >
              Admin
            </Badge>
          )}

          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-foreground break-words">
          {comment.content}
        </p>
      </div>

      {/* Delete button — ONLY author can delete */}
      {isAuthor && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className={cn(
            'shrink-0 rounded-md p-1.5 text-muted-foreground transition-all',
            'opacity-0 group-hover:opacity-100',
            'hover:bg-destructive/10 hover:text-destructive',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Delete comment"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
