'use client'

import Image from 'next/image'
import { Users } from 'lucide-react'

import type { Doc } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useAppRouter } from '@/hooks/use-app-router'
import { formatGroupPriceLabel } from '../utils/price'
import { Switch } from '@/components/ui/switch'
import { useWallet } from '@/lib/web3/WalletProvider'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

type GroupCardProps = {
  group: Doc<'groups'>
  owner: Doc<'users'> | null
  memberCount: number
  className?: string
}

function formatOwnerLabel(owner: Doc<'users'> | null) {
  if (!owner) return 'Unknown creator'

  return (
    owner.displayName ??
    (owner.walletAddress
      ? `${owner.walletAddress.slice(0, 6)}...${owner.walletAddress.slice(-4)}`
      : 'Unknown creator')
  )
}

export function GroupCard({
  group,
  owner,
  memberCount,
  className
}: GroupCardProps) {
  const router = useAppRouter()
  const { address } = useWallet()

  const toggleMarketplaceListing = useMutation(
    api.groups.toggleMarketplaceListing
  )

  const isOwner =
    !!address &&
    owner?.walletAddress?.toLowerCase() === address.toLowerCase()

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const memberLabel = memberCount === 1 ? 'member' : 'members'

  const handleNavigate = () => {
    router.push(`/${group._id}/about`)
  }

  const priceLabel = formatGroupPriceLabel(
    group.price,
    group.billingCadence,
    { includeCadence: true }
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigate()
      }}
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/80 text-left shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {/* ---------------- IMAGE HEADER ---------------- */}
      <div className="relative h-48 w-full overflow-hidden">
        {typeof group.thumbnailUrl === 'string' &&
        group.thumbnailUrl.trim() !== '' ? (
          <>
            <Image
              src={group.thumbnailUrl}
              alt={`${group.name} thumbnail`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-sm font-medium text-muted-foreground">
            No thumbnail
          </div>
        )}

        {/* Price badge */}
        <div className="absolute right-4 top-4 rounded-lg bg-primary/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {priceLabel}
          </span>
        </div>

        {/* Group name */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {group.name}
          </h3>
        </div>
      </div>

      {/* ---------------- BODY ---------------- */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {group.shortDescription ??
            group.description?.slice(0, 120) ??
            'Join this community to discover content and connect with like-minded members.'}
        </p>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {group.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                +{group.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Owner marketplace toggle */}
        {isOwner && (
          <div
            onClick={stopPropagation}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Marketplace
              </p>
              <p className="text-sm font-semibold">
                {group.isListed ? 'Listed' : 'Not listed'}
              </p>
            </div>

            <Switch
              checked={!!group.isListed}
              onCheckedChange={async checked => {
                if (!address) return
                await toggleMarketplaceListing({
                  groupId: group._id,
                  address,
                  isListed: checked
                })
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Members
                </p>
                <p className="text-sm font-bold text-foreground">
                  {memberCount} {memberLabel}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">
                Creator
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatOwnerLabel(owner)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
