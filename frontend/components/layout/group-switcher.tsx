'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { useQuery } from 'convex/react'
import { ChevronDown, Compass, Plus } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { useAppRouter } from '@/hooks/use-app-router'
import { useOptionalGroupContext } from '@/features/groups/context/group-context'
import { useWallet } from '@/lib/web3/WalletProvider'

export function GroupSwitcher() {
  const router = useAppRouter()
  const params = useParams()
  const { address } = useWallet()
  const groupContext = useOptionalGroupContext()

  const [open, setOpen] = useState(false)

  // ✅ Convex ONLY sees primitive address string (no signer, no wallet client)
  const ownedGroups = useQuery(
    api.groups.list,
    address ? { address } : { address: undefined }
  ) as Array<Doc<'groups'>> | undefined

  const currentGroupId =
    typeof params?.groupId === 'string' ? params.groupId : undefined

  const activeGroup = useMemo(() => {
    if (groupContext?.group) return groupContext.group
    if (!currentGroupId || !ownedGroups) return undefined

    return ownedGroups.find(
      group => group._id === (currentGroupId as Id<'groups'>)
    )
  }, [currentGroupId, groupContext, ownedGroups])

  const handleSelect = (groupId: Id<'groups'>) => {
    router.push(`/${groupId}/about`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="
            inline-flex items-center gap-2 rounded-lg px-3 py-2
            text-sm font-medium transition-all
            border border-border/40 bg-card/40 backdrop-blur-lg
            hover:border-primary/40 hover:bg-primary/5 hover:text-primary
          "
        >
          {activeGroup ? (
            <>
              <Avatar className="h-8 w-8 ring-1 ring-border/40">
                {activeGroup.thumbnailUrl && (
                  <AvatarImage
                    src={activeGroup.thumbnailUrl}
                    alt={`${activeGroup.name} thumbnail`}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {activeGroup.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{activeGroup.name}</span>
            </>
          ) : (
            <>
              <Compass className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Select a group
              </span>
            </>
          )}
          <ChevronDown
            className="
              h-4 w-4 transition-transform duration-200
              data-[state=open]:rotate-180
            "
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="
          w-72 p-3 rounded-xl border border-border/40 bg-card/80
          backdrop-blur-2xl shadow-xl
        "
        align="start"
      >
        {/* CREATE GROUP */}
        <button
          type="button"
          onClick={() => {
            router.push('/create')
            setOpen(false)
          }}
          className="
            flex w-full items-center gap-2 rounded-lg
            px-3 py-2 text-sm font-medium
            hover:bg-primary/10 hover:text-primary transition
          "
        >
          <Plus className="h-4 w-4" /> Create a group
        </button>

        {/* DISCOVER GROUPS */}
        <Link
          href="/groups"
          onClick={() => setOpen(false)}
          className="
            flex items-center gap-2 rounded-lg
            px-3 py-2 text-sm font-medium
            hover:bg-primary/10 hover:text-primary transition
          "
        >
          <Compass className="h-4 w-4" /> Discover groups
        </Link>

        {/* Divider label */}
        <div className="space-y-2 pt-2">
          <p className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            My groups
          </p>

          {/* Empty state */}
          {(!ownedGroups || ownedGroups.length === 0) && (
            <p className="px-2 text-xs text-muted-foreground">
              You have no groups yet.
            </p>
          )}

          {/* Group list */}
          {(ownedGroups ?? []).map(group => (
            <button
              type="button"
              key={group._id}
              onClick={() => handleSelect(group._id)}
              className="
                flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm
                hover:bg-primary/10 hover:text-primary transition
              "
            >
              <Avatar className="h-7 w-7 ring-1 ring-border/30">
                {group.thumbnailUrl && (
                  <AvatarImage
                    src={group.thumbnailUrl}
                    alt={`${group.name} thumbnail`}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {group.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{group.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

