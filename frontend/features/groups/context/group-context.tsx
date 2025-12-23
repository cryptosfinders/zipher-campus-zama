'use client'

import { createContext, useContext, useMemo, useEffect, useState } from 'react'

import { useQuery, useConvex } from 'convex/react'

import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { NotFoundView } from '@/components/empty-states/not-found-view'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'

import {
  isStorageReference,
  extractStorageId
} from '@/lib/media'

const DAY_MS = 24 * 60 * 60 * 1000
const RENEWAL_WARNING_MS = 5 * DAY_MS

function normalizeTimestamp(value: number | undefined | null) {
  if (!value || typeof value !== 'number') return undefined
  return value < 1_000_000_000_000 ? value * 1000 : value
}

type GroupContextValue = {
  group: Doc<'groups'> & {
    thumbnailResolvedUrl?: string | null
    galleryResolved?: string[]
  }
  owner: Doc<'users'> | null
  memberCount: number
  isOwner: boolean
  isMember: boolean
  administrators: Array<{
    user: Doc<'users'>
    shareBps: number
  }>
  access: {
    about: boolean
    feed: boolean
    classroom: boolean
    members: boolean
  }
  currentUser: Doc<'users'> | null
  media: {
    thumbnail: {
      url: string | null
      storageId?: string
      source: string | null
    } | null
    gallery: Array<{
      url: string
      storageId?: string
      source: string
    }>
  }
  membership: {
    status: 'active' | 'left' | null
    passExpiresAt?: number
    leftAt?: number
    joinedAt?: number
  }
  subscription: {
    endsOn: number | null
    lastPaidAt: number | null
    lastPaymentTxHash: string | null
    isExpired: boolean
    isRenewalDue: boolean
    daysRemaining: number | null
  }
}

const GroupContext = createContext<GroupContextValue | undefined>(undefined)

export function useGroupContext() {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroupContext must be used within a GroupProvider')
  }
  return context
}

export function useOptionalGroupContext() {
  return useContext(GroupContext)
}

type GroupProviderProps = {
  groupId: Id<'groups'>
  children: React.ReactNode
  expiredFallback?: React.ReactNode
}

export function GroupProvider({
  groupId,
  children,
  expiredFallback
}: GroupProviderProps) {
  const convex = useConvex()
  const { currentUser } = useCurrentUser()

  const viewerState = useQuery(api.groups.viewer, {
    groupId,
    viewerId: currentUser?._id
  })

  /**
   * -------------------------------------------------------------
   *   STEP 1 — Resolve Thumbnail URL from storage:xxxxx
   * -------------------------------------------------------------
   */
  const [resolvedThumbnailUrl, setResolvedThumbnailUrl] = useState<
    string | null
  >(null)

  useEffect(() => {
    async function resolve() {
      const raw = viewerState?.group?.thumbnailUrl
      if (!raw) {
        setResolvedThumbnailUrl(null)
        return
      }

      if (isStorageReference(raw)) {
        try {
          const id = extractStorageId(raw)
          if (!id) return
        const storageId = id as Id<'_storage'>  
	const { url } = await convex.query(api.media.getUrl, { storageId })
          setResolvedThumbnailUrl(url ?? null)
        } catch (err) {
          console.error('Failed to resolve thumbnail from storage:', err)
          setResolvedThumbnailUrl(null)
        }
      } else {
        setResolvedThumbnailUrl(raw)
      }
    }

    if (viewerState?.group) resolve()
  }, [viewerState?.group?.thumbnailUrl, convex])

  /**
   * -------------------------------------------------------------
   *   STEP 2 — Resolve Gallery URLs also
   * -------------------------------------------------------------
   */
  const [resolvedGalleryUrls, setResolvedGalleryUrls] = useState<string[]>([])

  useEffect(() => {
    async function resolveGallery() {
      const rawGallery = viewerState?.group?.galleryUrls ?? []
      const resolved: string[] = []

      for (const src of rawGallery) {
        if (isStorageReference(src)) {
          try {
            const id = extractStorageId(src)
            if (!id) continue
            const storageId = id as Id<'_storage'>
	    const { url } = await convex.query(api.media.getUrl, {
              storageId
            })
            if (url) resolved.push(url)
          } catch (err) {
            console.error('Failed gallery resolve:', err)
          }
        } else {
          resolved.push(src)
        }
      }

      setResolvedGalleryUrls(resolved)
    }

    if (viewerState?.group) resolveGallery()
  }, [viewerState?.group?.galleryUrls, convex])

  /**
   * -------------------------------------------------------------
   *   STEP 3 — Original GroupProvider logic
   * -------------------------------------------------------------
   */
  const result = useMemo<
    | { status: 'loading' | 'missing' | 'expired' }
    | { status: 'ready'; value: GroupContextValue }
  >(() => {
    if (viewerState === undefined || currentUser === undefined) {
      return { status: 'loading' as const }
    }

    if (viewerState === null) {
      return { status: 'missing' as const }
    }

    const normalizedEndsOn = normalizeTimestamp(viewerState.group.endsOn)
    const normalizedLastPaidAt = normalizeTimestamp(
      viewerState.group.lastSubscriptionPaidAt
    )
    const now = Date.now()
    const expired =
      typeof normalizedEndsOn === 'number' ? normalizedEndsOn < now : false

    const daysRemaining =
      typeof normalizedEndsOn === 'number'
        ? Math.max(0, Math.ceil((normalizedEndsOn - now) / DAY_MS))
        : null

    const renewalWarning =
      !expired &&
      typeof normalizedEndsOn === 'number' &&
      normalizedEndsOn - now <= RENEWAL_WARNING_MS

    if (expired && !viewerState.viewer.isOwner) {
      return { status: 'expired' as const }
    }

    return {
      status: 'ready' as const,
      value: {
        group: {
          ...viewerState.group,
          thumbnailResolvedUrl: resolvedThumbnailUrl,
          galleryResolved: resolvedGalleryUrls,
          tags: viewerState.group.tags ?? [],
          galleryUrls: viewerState.group.galleryUrls ?? [],
          visibility:
            viewerState.group.visibility ??
            ('private' as 'private' | 'public'),
          billingCadence:
            viewerState.group.billingCadence ??
            (viewerState.group.price > 0 ? 'monthly' : 'free'),
          endsOn: normalizedEndsOn ?? viewerState.group.endsOn,
          lastSubscriptionPaidAt:
            normalizedLastPaidAt ?? viewerState.group.lastSubscriptionPaidAt
        },
        owner: viewerState.owner,
        memberCount: viewerState.memberCount ?? viewerState.group.memberNumber,
        currentUser: currentUser ?? null,
        isOwner: viewerState.viewer.isOwner,
        isMember: viewerState.viewer.isMember,
        access: viewerState.viewer.canAccess,
        administrators: viewerState.administrators ?? [],
        media: {
          thumbnail: viewerState.media?.thumbnail
            ? {
                url: viewerState.media.thumbnail.url,
                storageId: viewerState.media.thumbnail.storageId,
                source: viewerState.media.thumbnail.source
              }
            : viewerState.group.thumbnailUrl
              ? {
                  url: viewerState.group.thumbnailUrl,
                  source: viewerState.group.thumbnailUrl
                }
              : null,
          gallery:
            viewerState.media?.gallery?.map(entry => ({
              url: entry.url,
              storageId: entry.storageId,
              source: entry.source
            })) ??
            (viewerState.group.galleryUrls ?? []).map(url => ({
              url,
              source: url
            }))
        },
        membership: {
          status:
            viewerState.viewer.membership?.status ??
            (viewerState.viewer.isMember ? 'active' : null),
          passExpiresAt: viewerState.viewer.membership?.passExpiresAt,
          leftAt: viewerState.viewer.membership?.leftAt,
          joinedAt: viewerState.viewer.membership?.joinedAt
        },
        subscription: {
          endsOn: normalizedEndsOn ?? null,
          lastPaidAt: normalizedLastPaidAt ?? null,
          lastPaymentTxHash: viewerState.group.lastSubscriptionTxHash ?? null,
          isExpired: expired,
          isRenewalDue: expired || renewalWarning,
          daysRemaining
        }
      }
    }
  }, [
    currentUser,
    viewerState,
    resolvedThumbnailUrl,
    resolvedGalleryUrls
  ])

  if (result.status !== 'ready') {
    if (result.status === 'expired') {
      return (
        expiredFallback ??
        <div className="flex h-full flex-1 items-center justify-center px-8 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              This group&apos;s subscription has expired.
            </h2>
            <p className="text-sm text-muted-foreground">
              Contact the group owner to renew access.
            </p>
          </div>
        </div>
      )
    }

    if (result.status === 'missing') {
      return (
        <div className="flex-1 px-6 py-16">
          <NotFoundView
            title="Group unavailable"
            message="The group you requested is unavailable or may have been deleted."
          />
        </div>
      )
    }

    return <LoadingIndicator fullScreen />
  }

  return (
    <GroupContext.Provider value={result.value}>
      {children}
    </GroupContext.Provider>
  )
}

