'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Check, Copy, Globe, Lock, Trash2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { useAppRouter } from '@/hooks/use-app-router'

import { useGroupContext } from '../context/group-context'
import { JoinGroupButton } from './join-group-button'
import { formatGroupPriceLabel } from '../utils/price'

const ZIPHER_GOLD = '#F7C948'
const ZIPHER_TEXT = '#111111'

export function GroupSidebar({ onEdit }: { onEdit?: () => void }) {
  const router = useAppRouter()
  const removeGroup = useMutation(api.groups.remove)
  const { group, owner, isOwner, memberCount } = useGroupContext()
  const totalMembers =
    typeof memberCount === 'number'
      ? memberCount
      : group.memberNumber ?? 0

  const [origin, setOrigin] = useState('')
  const [copied, setCopied] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  const groupUrl = origin ? `${origin}/${group._id}` : `/${group._id}`

  const privacy =
    group.visibility === 'public'
      ? { icon: Globe, label: 'Public group' }
      : { icon: Lock, label: 'Private group' }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(groupUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleEditClick = () => {
    onEdit ? onEdit() : router.push(`/${group._id}/edit`)
  }

  const handleDeleteGroup = async () => {
    if (isDeleting) return
    if (!owner?.walletAddress) {
      toast.error('Owner wallet unavailable.')
      return
    }

    try {
      setIsDeleting(true)
      await removeGroup({
        groupId: group._id,
        ownerAddress: owner.walletAddress
      })

      toast.success('Group deleted.')
      setDeleteDialogOpen(false)
      router.push('/groups')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete group.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <aside
      className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 shadow-sm"
      style={{ borderColor: ZIPHER_GOLD + '40' }}
    >
      {/* THUMBNAIL */}
      {group.thumbnailUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={group.thumbnailUrl}
            alt={`${group.name} thumbnail`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted/40 text-muted-foreground">
          <span className="text-xs font-medium uppercase tracking-wide">No thumbnail</span>
        </div>
      )}

      {/* NAME + URL */}
      <div className="space-y-3">
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: ZIPHER_TEXT }}>
          {group.name}
        </h2>

        <div
          className="group relative flex items-center gap-2 rounded-lg border p-3 transition"
          style={{ borderColor: ZIPHER_GOLD + '40', background: 'rgba(247, 201, 72, 0.06)' }}
        >
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Group Link
            </p>
            <p className="truncate text-sm font-mono" style={{ color: ZIPHER_TEXT }}>
              {groupUrl}
            </p>
          </div>

          <button
            onClick={handleCopyUrl}
            className="flex h-9 w-9 items-center justify-center rounded-md transition-all active:scale-95"
            style={{
              background: copied ? ZIPHER_GOLD : ZIPHER_GOLD + '33',
              color: ZIPHER_TEXT
            }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm leading-relaxed" style={{ color: ZIPHER_TEXT }}>
        {group.shortDescription ?? 'No summary provided yet.'}
      </p>

      {/* METRICS */}
      <div
        className="grid grid-cols-3 gap-4 border-t pt-4 text-center"
        style={{ borderColor: ZIPHER_GOLD + '30' }}
      >
        <div>
          <div className="text-xl font-bold" style={{ color: ZIPHER_TEXT }}>
            {totalMembers}
          </div>
          <div className="text-xs text-muted-foreground">Members</div>
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color: ZIPHER_TEXT }}>
            0
          </div>
          <div className="text-xs text-muted-foreground">Online</div>
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color: ZIPHER_TEXT }}>
            1
          </div>
          <div className="text-xs text-muted-foreground">Admins</div>
        </div>
      </div>

      {/* OWNER CONTROLS */}
      {isOwner ? (
        <div className="space-y-3">
          <Button
            className="w-full font-semibold"
            onClick={handleEditClick}
            style={{
              borderColor: ZIPHER_GOLD,
              color: ZIPHER_GOLD,
              background: 'transparent'
            }}
            variant="outline"
          >
            Edit group details
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full font-semibold"
                variant="destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete group
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this group?</DialogTitle>
                <DialogDescription>
                  This will permanently delete the group and all its content.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteGroup}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting…' : 'Delete group'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <JoinGroupButton />
      )}
    </aside>
  )
}
