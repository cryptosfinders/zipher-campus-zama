'use client'

import { useQuery } from 'convex/react'

import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import { GroupMemberCard } from '@/features/groups/components/group-member-card'
import { JoinGroupButton } from '@/features/groups/components/join-group-button'
import { MemberInviteForm } from '@/features/groups/components/member-invite-form'
import { useGroupContext } from '@/features/groups/context/group-context'

type GroupMembersPageProps = {
  params: Promise<{
    groupId: string
  }>
}

export default function GroupMembersPage(_: GroupMembersPageProps) {
  const { group, isOwner, currentUser, access } = useGroupContext()

  const members = useQuery(api.groups.getMembers, {
    id: group._id,
    viewerId: currentUser?._id ?? undefined
  }) as Array<Doc<'users'>> | undefined

  /* ❌ Not a member → Show Gold Locked View */
  if (!access.members) {
    return (
      <div
        className="
          flex flex-col items-center justify-center space-y-6
          rounded-2xl border border-primary/30 bg-primary/5
          shadow-sm shadow-primary/10 backdrop-blur-sm
          px-8 py-16 text-center
        "
      >
        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl font-bold text-foreground">
            Become a member to view the roster
          </h2>
          <p className="text-sm text-muted-foreground">
            Member directories, admin tools, and invitations unlock once you join.
          </p>
        </div>

        <JoinGroupButton />
      </div>
    )
  }

  /* ⏳ Loading */
  if (members === undefined) {
    return <LoadingIndicator fullScreen />
  }

  /* ✅ Members List */
  return (
    <div className="space-y-8">

      {/* Only owners can invite members */}
      {isOwner && (
        <div
          className="
            rounded-2xl border border-primary/30 bg-card/90 
            shadow-sm shadow-primary/10 backdrop-blur-sm p-6
          "
        >
          <MemberInviteForm groupId={group._id} />
        </div>
      )}

      {/* Members list */}
      <div className="space-y-4">
        {members.map(member => (
          <div
            key={member._id}
            className="
              rounded-xl border border-primary/20 bg-card/80 
              shadow-sm shadow-primary/5 backdrop-blur-sm p-4 
              transition hover:border-primary/30
            "
          >
            <GroupMemberCard member={member} />
          </div>
        ))}
      </div>
    </div>
  )
}
