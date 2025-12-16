'use client'

import { format } from 'date-fns'
import { Calendar } from 'lucide-react'

import type { Doc } from '@/convex/_generated/dataModel'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { useGroupContext } from '../context/group-context'

type GroupMemberCardProps = {
  member: Doc<'users'>
}

function getInitials(member: Doc<'users'>) {
  if (member.displayName) {
    return member.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(token => token[0]?.toUpperCase() ?? '')
      .join('')
  }

  return member.walletAddress.slice(2, 4).toUpperCase()
}

export function GroupMemberCard({ member }: GroupMemberCardProps) {
  const { group } = useGroupContext()
  const joinedAt = format(member._creationTime, 'MMM dd, yyyy')
  const isOwner = group.ownerId === member._id
  const initials = getInitials(member)

  return (
    <article
      className="
        flex items-start gap-4 
        rounded-xl border border-border/60 
        bg-card/60 backdrop-blur-sm 
        p-5 shadow-sm
      "
    >
      {/* Avatar */}
      <Avatar className="h-14 w-14 border border-border/50 shadow-sm rounded-lg">
        <AvatarFallback className="bg-primary/15 text-primary font-semibold uppercase">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Member Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground leading-tight">
              {member.displayName ?? member.walletAddress}
            </p>

            {isOwner && (
              <span
                className="
                  inline-block rounded-full 
                  bg-primary/10 text-primary 
                  border border-primary/20 
                  px-2.5 py-0.5 text-xs font-semibold
                "
              >
                Owner
              </span>
            )}
          </div>
        </div>

        {member.about && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {member.about}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          <span>Joined {joinedAt}</span>
        </div>
      </div>
    </article>
  )
}
