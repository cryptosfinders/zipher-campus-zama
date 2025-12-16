'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { PencilLine, ThumbsUp, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'

import { useApiMutation } from '@/hooks/use-api-mutation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useGroupContext } from '@/features/groups/context/group-context'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import { GroupPostContent } from './group-post-content'

type GroupPostCardProps = {
  post: Doc<'posts'> & {
    likes: Doc<'likes'>[]
    comments: Doc<'comments'>[]
    author: Doc<'users'>
  }
  className?: string
}

export function GroupPostCard({ post, className }: GroupPostCardProps) {
  const { currentUser, address } = useCurrentUser()
  const { owner, administrators } = useGroupContext()

  const { mutate: likePost, pending: isLiking } = useApiMutation(api.likes.add)
  const { mutate: removePost, pending: isRemoving } = useApiMutation(api.posts.remove)
  const { mutate: updatePost, pending: isUpdating } = useApiMutation(api.posts.updateContent)

  const isOwner = currentUser?._id === post.author._id
  const isGroupOwner = post.author._id === owner?._id
  const isAdmin = administrators.some(a => a.user._id === post.author._id)

  const authorAddr = post.author.walletAddress as `0x${string}`
  const authorLabel =
    post.author.displayName?.trim() ||
    `${authorAddr.slice(0, 6)}...${authorAddr.slice(-4)}`

  const createdAtLabel = formatDistanceToNow(post._creationTime, { addSuffix: true })

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content ?? '')

  const canUpdate =
    Boolean(title.trim()) &&
    Boolean(content.trim()) &&
    Boolean(address) &&
    !isUpdating

  const openEditDialog = () => {
    setTitle(post.title)
    setContent(post.content ?? '')
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    if (!address || !canUpdate) return
    try {
      await updatePost({
        id: post._id,
        title: title.trim(),
        content: content.trim(),
        address
      })
      setIsEditing(false)
      toast.success('Post updated')
    } catch {
      toast.error('Unable to update post.')
    }
  }

  return (
    <article
      className={cn(
        'rounded-2xl border border-border/40 bg-card/70 backdrop-blur-xl p-6 shadow-lg shadow-black/5 transition hover:shadow-xl',
        className
      )}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-border/60">
            {post.author.avatarUrl ? (
              <AvatarImage src={post.author.avatarUrl} alt={authorLabel} />
            ) : null}
            <AvatarFallback className="bg-primary/10 font-semibold text-primary uppercase">
              {authorLabel.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{authorLabel}</p>

              {isGroupOwner && (
                <Badge variant="default" className="text-[10px] px-2 py-0.5">Owner</Badge>
              )}

              {!isGroupOwner && isAdmin && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">Admin</Badge>
              )}
            </div>

            <span className="text-xs text-muted-foreground">{createdAtLabel}</span>
          </div>
        </div>

        {/* ACTIONS (edit/delete) */}
        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openEditDialog}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            >
              <PencilLine className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={isRemoving}
              onClick={() => address && removePost({ id: post._id, address })}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted/40 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-bold text-foreground">{post.title}</h2>
        <GroupPostContent content={post.content} />
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-6 border-t border-border/40 pt-3 text-sm text-muted-foreground">
        <button
          type="button"
          disabled={!address || isLiking}
          onClick={() => likePost({ postId: post._id, address })}
          className="flex items-center gap-2 transition text-muted-foreground hover:text-primary"
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{post.likes.length}</span>
        </button>

        <span className="font-medium">{post.comments.length} comments</span>
      </div>

      {/* EDIT POST MODAL */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-card/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update your title or content.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Post content"
              value={content}
              rows={5}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>

            <Button
              onClick={handleUpdate}
              disabled={!canUpdate}
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
