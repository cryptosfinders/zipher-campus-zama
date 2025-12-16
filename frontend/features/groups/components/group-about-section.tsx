'use client'

import { useMemo, useEffect, useState } from 'react'
import {
  Calendar,
  Globe,
  Lock,
  Users,
  Tag,
  ShieldCheck
} from 'lucide-react'

import { useRouter } from 'next/navigation'

import { formatTimestampRelative } from '@/lib/time'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GroupDescriptionEditor } from './group-description-editor'
import { GroupMediaCarousel } from './group-media-carousel'
import { useGroupContext } from '../context/group-context'
import { formatGroupPriceLabel } from '../utils/price'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { extractStorageId, isStorageReference } from '@/lib/media'

export function GroupAboutSection() {
  const router = useRouter()
  const convex = useConvex()

  const {
    group,
    owner,
    isOwner,
    memberCount,
    membership,
    currentUser,
    administrators
  } = useGroupContext()

  /* -------------------------------------------------------------------------- */
  /* 🟡 LOCAL STATE — resolved URLs                                             */
  /* -------------------------------------------------------------------------- */
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(null)
  const [resolvedAboutUrl, setResolvedAboutUrl] = useState<string | null>(null)
  const [resolvedGalleryUrls, setResolvedGalleryUrls] = useState<string[]>([])

  /* -------------------------------------------------------------------------- */
  /* 🔵 Resolve storage:xxxxx → real URLs using Convex                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function resolveAll() {
      /** THUMBNAIL */
      if (group.thumbnailUrl) {
        if (isStorageReference(group.thumbnailUrl)) {
          const id = extractStorageId(group.thumbnailUrl)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          setResolvedThumbnail(url ?? null)
        } else {
          setResolvedThumbnail(group.thumbnailUrl)
        }
      } else {
        setResolvedThumbnail(null)
      }

      /** ABOUT URL */
      if (group.aboutUrl) {
        if (isStorageReference(group.aboutUrl)) {
          const id = extractStorageId(group.aboutUrl)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          setResolvedAboutUrl(url ?? null)
        } else {
          setResolvedAboutUrl(group.aboutUrl)
        }
      } else {
        setResolvedAboutUrl(null)
      }

      /** GALLERY URLS */
      const gallery = group.galleryUrls ?? []
      const resolved: string[] = []

      for (const item of gallery) {
        if (isStorageReference(item)) {
          const id = extractStorageId(item)
          const { url } = await convex.query(api.media.getUrl, { storageId: id })
          if (url) resolved.push(url)
        } else {
          resolved.push(item)
        }
      }

      setResolvedGalleryUrls(resolved)
    }

    resolveAll()
  }, [
    convex,
    group.thumbnailUrl,
    group.aboutUrl,
    group.galleryUrls
  ])

  /* -------------------------------------------------------------------------- */
  /* EXISTING GROUP LOGIC (unchanged)                                           */
  /* -------------------------------------------------------------------------- */

  const totalMembers =
    typeof memberCount === 'number'
      ? memberCount
      : group.memberNumber ?? 0

  const priceLabel = formatGroupPriceLabel(group.price, group.billingCadence, {
    includeCadence: true
  })

  const creatorName =
    owner?.displayName ??
    (owner?.walletAddress
      ? `${owner.walletAddress.slice(0, 6)}...${owner.walletAddress.slice(-4)}`
      : 'Unknown creator')

  const creatorInitials = useMemo(() => {
    if (!creatorName) return '?'
    const parts = creatorName.split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }, [creatorName])

  const isAdmin = useMemo(() => {
    if (isOwner) return true
    if (!currentUser) return false
    return administrators?.some(a => a.user._id === currentUser._id) ?? false
  }, [administrators, currentUser, isOwner])

  const adminPrivilegeMessage = useMemo(() => {
    if (!isAdmin) return null
    return isOwner
      ? 'You own this group. Owner privileges give full administrative control.'
      : 'You are an administrator for this group with elevated permissions.'
  }, [isAdmin, isOwner])

  const membershipExpiryLabel = useMemo(() => {
    if (membership.status !== 'active' || isAdmin) return null
    if (!membership.expiresAt) return 'No expiry scheduled'
    const expiry = membership.expiresAt
    return `${new Date(expiry).toLocaleString()} (${formatTimestampRelative(
      Math.floor(expiry / 1000)
    )})`
  }, [isAdmin, membership.status, membership.expiresAt])

  const privacy =
    group.visibility === 'public'
      ? { icon: Globe, label: 'Public community' }
      : { icon: Lock, label: 'Private community' }

  /* -------------------------------------------------------------------------- */
  /* FINAL MEDIA SOURCES FOR CAROUSEL                                          */
  /* -------------------------------------------------------------------------- */
  const mediaSources = useMemo(() => {
    const arr: string[] = []
    if (resolvedAboutUrl) arr.push(resolvedAboutUrl)
    if (resolvedGalleryUrls.length > 0) arr.push(...resolvedGalleryUrls)
    return arr
  }, [resolvedAboutUrl, resolvedGalleryUrls])

  /* -------------------------------------------------------------------------- */
  /* RENDER UI                                                                  */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="space-y-8">

      {/* Title + media */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">{group.name}</h1>

          {/* 🟢 EDIT BUTTON — owners only */}
          {isOwner && (
            <button
              className="rounded-lg px-4 py-2 text-sm bg-primary text-black hover:opacity-80"
              onClick={() => router.push(`/${group._id}/edit`)}
            >
              Edit Group
            </button>
          )}
        </div>

        <GroupMediaCarousel
          sources={mediaSources}
          fallbackImage={resolvedThumbnail ?? undefined}
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <privacy.icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{privacy.label}</span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(totalMembers)}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{priceLabel}</span>
        </div>

        {owner && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Avatar className="h-6 w-6">
                {owner.avatarUrl ? (
                  <AvatarImage src={owner.avatarUrl} alt={creatorName} />
                ) : null}
                <AvatarFallback className="text-xs font-semibold">
                  {creatorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">By {creatorName}</span>
            </div>
          </>
        )}
      </div>

      {/* Admin / membership */}
      {adminPrivilegeMessage ? (
        <div className="rounded-lg border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
          <ShieldCheck className="mr-2 inline h-4 w-4" />
          {adminPrivilegeMessage}
        </div>
      ) : membershipExpiryLabel ? (
        <div className="rounded-lg border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
          <Calendar className="mr-2 inline h-4 w-4" />
          Your access expires {membershipExpiryLabel}
        </div>
      ) : null}

      {/* Description */}
      <GroupDescriptionEditor
        editable={isOwner}
        groupId={group._id}
        initialContent={group.description}
      />
    </div>
  )
}
