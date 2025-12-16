'use client'

import { useQuery } from 'convex/react'

import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import { GroupPostComposer } from '@/features/groups/components/group-post-composer'
import { GroupPostThread } from '@/features/groups/components/group-post-thread'
import { JoinGroupButton } from '@/features/groups/components/join-group-button'
import { useGroupContext } from '@/features/groups/context/group-context'

type PostWithRelations = Doc<'posts'> & {
  likes: Doc<'likes'>[]
  comments: Doc<'comments'>[]
  author: Doc<'users'>
}

export default function GroupFeedPage() {
  const { group, access } = useGroupContext()

  if (!access.feed) {
    return (
      <div
        className="
          flex flex-col items-center justify-center space-y-6 
          rounded-2xl border border-primary/30 
          bg-primary/5 px-8 py-16 text-center
          shadow-sm shadow-primary/10 backdrop-blur-sm
        "
      >
        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl font-bold text-foreground">
            Join this group to access the feed
          </h2>
          <p className="text-sm text-muted-foreground">
            Discussions, announcements, and community threads unlock once you become a member.
          </p>
        </div>

        <JoinGroupButton />
      </div>
    )
  }

  const posts = useQuery(api.posts.list, {
    groupId: group._id
  }) as PostWithRelations[] | undefined

  if (posts === undefined) {
    return <LoadingIndicator fullScreen />
  }

  return (
    <div className="space-y-8">

      {/* Composer */}
      <div
        className="
          rounded-2xl border border-primary/30 
          bg-card/90 backdrop-blur-sm 
          shadow-sm shadow-primary/10 p-4
        "
      >
        <GroupPostComposer groupId={group._id} />
      </div>

      {/* Threads */}
      <div className="space-y-6">
        {posts.map(post => (
          <div
            key={post._id}
            className="
              rounded-2xl border border-primary/20 
              bg-card/80 backdrop-blur-sm 
              shadow-sm shadow-primary/5 p-4
              transition hover:border-primary/30
            "
          >
            <GroupPostThread post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
