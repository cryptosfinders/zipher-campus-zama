// frontend/features/groups/components/group-settings-form.tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Plus, Trash2, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'

import { useEthereumAccount } from '@/hooks/use-ethereum-account'
import { useAppRouter } from '@/hooks/use-app-router'
import { usePlatformFeeQuote } from '@/hooks/use-platform-fee-quote'
import { useRenewSubscription } from '../hooks/use-renew-subscription'
import { useGroupContext } from '../context/group-context'

import { GroupMediaFields } from './group-media-fields'
import { isValidMediaReference, normalizeMediaInput } from '../utils/media'
import { resolveMembershipCourseId } from '../utils/membership'

import { ADDRESSES } from '@/lib/onchain/contracts'

import {
  MEMBERSHIP_DURATION_SECONDS,
  MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS,
  NATIVE_TOKEN_SYMBOL
} from '@/lib/config'
import { MembershipPassService } from '@/lib/onchain/services/membershipPassService'
import { RegistrarService } from '@/lib/onchain/services/registrarService'
import { registrarAbi } from '@/lib/onchain/abi/registrarAbi'
import { parseNativeTokenAmount } from '@/lib/native-token'
import { formatTimestampRelative } from '@/lib/time'
import { cn } from '@/lib/utils'
import { publicClient } from '@/lib/onchain/network'

const ZIPHER = '#F7C948' // Zipher Campus gold

/* -------------------------------------------------------------------------- */
/*                                    ZOD                                     */
/* -------------------------------------------------------------------------- */

const administratorSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .min(1, 'Wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Enter a valid wallet address'),
  share: z
    .string()
    .trim()
    .min(1, 'Share is required')
    .refine(value => !Number.isNaN(Number(value)), 'Enter a valid percentage')
    .refine(value => Number(value) > 0, 'Share must be greater than 0')
    .refine(value => Number(value) <= 100, 'Share cannot exceed 100')
})

const settingsSchema = z
  .object({
    shortDescription: z
      .string()
      .max(200, 'Keep the summary under 200 characters')
      .optional(),
    aboutUrl: z
      .string()
      .trim()
      .url('Enter a valid URL')
      .optional()
      .or(z.literal('')),
    thumbnailUrl: z.string().optional(),
    galleryUrls: z.array(z.string()).default([]),
    tags: z.string().optional(),
    visibility: z.enum(['public', 'private']).default('private'),
    billingCadence: z.enum(['free', 'monthly']).default('free'),
    price: z.string().optional(),
    administrators: z.array(administratorSchema).optional()
  })
  .superRefine((data, ctx) => {
    // ---------------- Paid memberships ----------------
    if (data.billingCadence === 'monthly') {
      if (!data.price || data.price.trim() === '') {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Monthly pricing is required'
        })
      } else if (Number.isNaN(Number(data.price))) {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid number'
        })
      } else if (Number(data.price) <= 0) {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Price must be greater than zero'
        })
      }

      if (data.visibility !== 'private') {
        ctx.addIssue({
          path: ['visibility'],
          code: z.ZodIssueCode.custom,
          message: 'Paid memberships must be private.'
        })
      }
    }

    // ---------------- Admin validation ----------------
    const admins = data.administrators ?? []
    if (admins.length > 0) {
      const seen = new Set<string>()
      let totalShare = 0

      admins.forEach((admin, index) => {
        const normalizedWallet = admin.walletAddress.trim().toLowerCase()
        if (seen.has(normalizedWallet)) {
          ctx.addIssue({
            path: ['administrators', index, 'walletAddress'],
            code: z.ZodIssueCode.custom,
            message: 'Duplicate administrator'
          })
        } else {
          seen.add(normalizedWallet)
        }

        const shareValue = Number(admin.share)
        if (!Number.isNaN(shareValue)) {
          totalShare += shareValue
        }
      })

      if (totalShare > 100) {
        ctx.addIssue({
          path: ['administrators'],
          code: z.ZodIssueCode.custom,
          message: 'Total share cannot exceed 100%.'
        })
      }
    }

    // ---------------- Media validation ----------------
    if (!isValidMediaReference(data.thumbnailUrl)) {
      ctx.addIssue({
        path: ['thumbnailUrl'],
        code: z.ZodIssueCode.custom,
        message:
          'Thumbnail must be either a Convex upload, a valid image URL, or a supported video link (YouTube, Vimeo).'
      })
    }

    data.galleryUrls?.forEach((entry, index) => {
      if (!isValidMediaReference(entry)) {
        ctx.addIssue({
          path: ['galleryUrls', index],
          code: z.ZodIssueCode.custom,
          message:
            'Each gallery item must be a Convex upload, an image URL, or a supported video link (YouTube, Vimeo).'
        })
      }
    })
  })

type GroupSettingsValues = z.infer<typeof settingsSchema>

type RegistrationState =
  | { status: 'checking' }
  | { status: 'registered' }
  | { status: 'missing'; message: string }
  | { status: 'error'; message: string }

type GroupSettingsFormProps = {
  group: Doc<'groups'>
}

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export function GroupSettingsForm({ group }: GroupSettingsFormProps) {
  const { address } = useEthereumAccount()
  const client = useMemo(() => publicClient(), [])

  const {
    owner,
    administrators: existingAdministrators,
    media,
    subscription
  } = useGroupContext()

  const updateSettings = useMutation(api.groups.updateSettings)
  const resetSubscriptionIdMutation = useMutation(api.groups.resetSubscriptionId)
  const generateUploadUrl = useMutation(api.media.generateUploadUrl)

  const [isSaving, setIsSaving] = useState(false)
  const [isRegisteringCourse, setIsRegisteringCourse] = useState(false)
  const [isResettingCourseId, setIsResettingCourseId] = useState(false)

  const { renew: triggerRenewSubscription, isRenewing: isSubscriptionRenewing } =
    useRenewSubscription()
  const { label: platformFeeLabel } = usePlatformFeeQuote()

  const membershipCourseId = useMemo(
    () => resolveMembershipCourseId(group),
    [group]
  )

  const membershipAddress = ADDRESSES.MEMBERSHIP
  const registrarAddress = ADDRESSES.REGISTRAR
  const marketplaceAddress = ADDRESSES.MARKETPLACE


  const membershipService = useMemo(() => {
    if (!membershipAddress || !publicClient) return null
    return new MembershipPassService({
      publicClient,
      address: membershipAddress
    })
  }, [membershipAddress, publicClient])

  const registrarService = useMemo(() => {
    if (!registrarAddress || !publicClient) return null
    return new RegistrarService({
      publicClient,
      address: registrarAddress
    })
  }, [publicClient, registrarAddress])

  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    () =>
      membershipCourseId
        ? { status: 'checking' }
        : { status: 'missing', message: 'Membership course ID not assigned.' }
  )

  const router = useAppRouter()
  const ownerAddress = owner?.walletAddress?.toLowerCase() ?? null

  /* ------------------------------------------------------------------------ */
  /* INITIAL MEDIA SNAPSHOT (for editing)                                     */
  /* ------------------------------------------------------------------------ */

  const initialThumbnailSource = normalizeMediaInput(
    media.thumbnail?.source ?? group.thumbnailUrl ?? ''
  )

  const initialGallerySources = media.gallery.map(item => item.source)

  const mediaSnapshot = useMemo(
    () => ({
      thumbnailSource: media.thumbnail?.source ?? group.thumbnailUrl ?? '',
      thumbnailUrl: media.thumbnail?.url ?? null,
      gallery: media.gallery.map(entry => ({
        source: entry.source,
        url: entry.url,
        storageId: entry.storageId
      }))
    }),
    [
      group.thumbnailUrl,
      media.gallery,
      media.thumbnail?.source,
      media.thumbnail?.url
    ]
  )

  /* ------------------------------------------------------------------------ */
  /* REACT HOOK FORM                                                          */
  /* ------------------------------------------------------------------------ */

  const form = useForm<GroupSettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      shortDescription: group.shortDescription ?? '',
      aboutUrl: group.aboutUrl ?? '',
      thumbnailUrl: initialThumbnailSource,
      galleryUrls: initialGallerySources,
      tags: (group.tags ?? []).join(', '),
      visibility: group.visibility ?? 'private',
      billingCadence:
        group.billingCadence ?? (group.price > 0 ? 'monthly' : 'free'),
      price: group.price ? String(group.price) : '',
      administrators: existingAdministrators.map(admin => ({
        walletAddress: admin.user.walletAddress,
        share: (admin.shareBps / 100).toString()
      }))
    }
  })

  const billingCadence = form.watch('billingCadence')

  // Keep paid groups private
  useEffect(() => {
    if (
      billingCadence === 'monthly' &&
      form.getValues('visibility') !== 'private'
    ) {
      form.setValue('visibility', 'private', {
        shouldDirty: true,
        shouldValidate: true
      })
    }
  }, [billingCadence, form])

  /* ------------------------------------------------------------------------ */
  /* MEMBERSHIP REGISTRATION STATUS                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!membershipCourseId) {
      setRegistrationState({
        status: 'missing',
        message: 'Membership course ID not assigned.'
      })
      return
    }

    if (!membershipAddress) {
      setRegistrationState({
        status: 'error',
        message: 'Membership contract address is not configured.'
      })
      return
    }

    if (!membershipService) {
      setRegistrationState({ status: 'checking' })
      return
    }

    let cancelled = false
    setRegistrationState({ status: 'checking' })

    membershipService
      .getCourse(membershipCourseId)
      .then(() => {
        if (!cancelled) {
          setRegistrationState({ status: 'registered' })
        }
      })
      .catch(error => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : String(error)
        const notFound = /CourseNotFound/i.test(message)
        if (!notFound) {
          console.error('Failed to verify course registration', error)
        }
        setRegistrationState(
          notFound
            ? {
                status: 'missing',
                message:
                  'No on-chain course found for this ID. Register it to enable paid memberships.'
              }
            : {
                status: 'error',
                message: 'Unable to confirm on-chain course. Try again later.'
              }
        )
      })

    return () => {
      cancelled = true
    }
  }, [membershipAddress, membershipCourseId, membershipService])

  /* ------------------------------------------------------------------------ */
  /* FIELD ARRAY – ADMINS                                                     */
  /* ------------------------------------------------------------------------ */

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'administrators'
  })

  /* ------------------------------------------------------------------------ */
  /* ON-CHAIN / SUBSCRIPTION DERIVED LABELS                                   */
  /* ------------------------------------------------------------------------ */

  const courseIdDisplay =
    group.subscriptionId ??
    (membershipCourseId ? membershipCourseId.toString() : 'Not assigned')

  const canRegisterOnchain =
    !!ownerAddress && address?.toLowerCase() === ownerAddress

  const registrationActionLabel =
    registrationState.status === 'error'
      ? 'Retry registration'
      : 'Register on-chain'

  const registrationStatusText =
    registrationState.status === 'registered'
      ? 'Registered on-chain'
      : registrationState.status === 'checking'
        ? 'Checking…'
        : registrationState.status === 'missing'
          ? 'Not registered'
          : 'Status unknown'

  const registrationDescription =
    registrationState.status === 'registered'
      ? 'Course is active on-chain. You can update pricing or listing options whenever you are ready to sell memberships.'
      : registrationState.status === 'checking'
        ? 'Confirming on-chain course details…'
        : registrationState.message ?? 'Unable to resolve course status.'

  const showRegistrationButton =
    canRegisterOnchain &&
    membershipCourseId !== null &&
    (registrationState.status === 'missing' ||
      registrationState.status === 'error')

  const canResetCourseId =
    canRegisterOnchain && registrationState.status !== 'registered'

  const subscriptionRenewalLabel = subscription.endsOn
    ? formatTimestampRelative(subscription.endsOn)
    : 'Not scheduled'
  const subscriptionLastPaidLabel = subscription.lastPaidAt
    ? formatTimestampRelative(subscription.lastPaidAt)
    : null
  const subscriptionCardDescription = subscription.isExpired
    ? 'Renew now to reactivate your community for another month.'
    : subscription.isRenewalDue
      ? 'Renew soon to avoid an interruption to your community access.'
      : 'Your platform subscription is active.'
  const subscriptionCardClasses = cn(
    'space-y-3 rounded-xl border border-border p-4',
    subscription.isExpired
      ? 'border-destructive/40 bg-destructive/5'
      : subscription.isRenewalDue
        ? `border-[${ZIPHER}]/30 bg-[${ZIPHER}]/10`
        : 'border-border/60 bg-card/30'
  )

  /* ------------------------------------------------------------------------ */
  /* MEDIA UPLOAD URL HELPER (Convex)                                         */
  /* ------------------------------------------------------------------------ */

  const requestUploadUrl = useCallback(async () => {
    const result = await generateUploadUrl({})
    return result.uploadUrl as string
  }, [generateUploadUrl])

  /* ------------------------------------------------------------------------ */
  /* AGGREGATIONS – admin shares                                              */
  /* ------------------------------------------------------------------------ */

  const administratorsValues = form.watch('administrators') ?? []
  const totalAdminShare = administratorsValues.reduce((total, admin) => {
    const share = Number(admin?.share)
    if (!Number.isFinite(share) || share < 0) {
      return total
    }
    return total + share
  }, 0)
  const ownerShare = Math.max(0, Number((100 - totalAdminShare).toFixed(2)))

  /* ------------------------------------------------------------------------ */
  /* HANDLERS                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleRenewSubscription = useCallback(async () => {
    try {
      const result = await triggerRenewSubscription()
      toast.success(
        `Subscription renewed. Next renewal ${
          result.endsOn
            ? formatTimestampRelative(result.endsOn)
            : 'scheduled in 30 days'
        }.`
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to renew the subscription. Please try again.'
      )
    }
  }, [triggerRenewSubscription])

  const handleRegisterCourse = useCallback(async () => {
    if (!canRegisterOnchain) {
      toast.error('Only the group owner can register the course on-chain.')
      return
    }
    if (!membershipCourseId) {
      toast.error('Membership course ID is not available.')
      return
    }
    if (!registrarAddress) {
      toast.error('Registrar contract address not configured.')
      return
    }
    if (!marketplaceAddress) {
      toast.error('Marketplace contract address not configured.')
      return
    }
    const ownerWalletAddress = owner?.walletAddress as
      | `0x${string}`
      | undefined
    if (!ownerWalletAddress) {
      toast.error('Owner wallet address unavailable.')
      return
    }
    if (!registrarService) {
      toast.error('Registrar service not ready. Check configuration.')
      return
    }
    if (!address) {
      toast.error('Connect your wallet to continue.')
      return
    }

    try {
      setIsRegisteringCourse(true)

      const registrarMarketplace = (await client.readContract({
        address: registrarAddress as `0x${string}`,
        abi: registrarAbi,
        functionName: 'marketplace'
      })) as `0x${string}`

      if (
        !registrarMarketplace ||
        registrarMarketplace ===
          '0x0000000000000000000000000000000000000000'
      ) {
        toast.error(
          'Registrar is not configured with a marketplace address. Contact an admin.'
        )
        return
      }

      const priceValue =
        typeof group.price === 'number' && Number.isFinite(group.price)
          ? group.price
          : 0
      const membershipPriceAmount = parseNativeTokenAmount(
        priceValue.toString()
      )

      await client.simulateContract({
        address: registrarAddress as `0x${string}`,
        abi: registrarAbi,
        functionName: 'registerCourse',
        args: [
          membershipCourseId,
          membershipPriceAmount,
          [ownerWalletAddress],
          [10000],
          BigInt(MEMBERSHIP_DURATION_SECONDS),
          BigInt(MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS)
        ],
        account: address as `0x${string}`
      })

      const tx = await registrarService.registerCourse(
        membershipCourseId,
        membershipPriceAmount,
        [ownerWalletAddress],
        [10000],
        BigInt(MEMBERSHIP_DURATION_SECONDS),
        BigInt(MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS)
      )
      await tx.wait()
      setRegistrationState({ status: 'registered' })
      toast.success('Membership course registered on-chain.')
    } catch (error: any) {
      console.error('Failed to register course on-chain', error)
      const message =
        error?.shortMessage ??
        error?.message ??
        'Course registration failed. Review your configuration and try again.'
      toast.error(message)
    } finally {
      setIsRegisteringCourse(false)
    }
  }, [
    address,
    canRegisterOnchain,
    group.price,
    marketplaceAddress,
    membershipCourseId,
    owner?.walletAddress,
    publicClient,
    registrarAddress,
    registrarService
  ])

  const handleResetCourseId = useCallback(async () => {
    if (!canRegisterOnchain) {
      toast.error('Only the group owner can reset the course ID.')
      return
    }
    if (!address) {
      toast.error('Connect your wallet to continue.')
      return
    }

    try {
      setIsResettingCourseId(true)
      const result = (await resetSubscriptionIdMutation({
        groupId: group._id,
        ownerAddress: address
      })) as { subscriptionId?: string } | undefined

      const newId = result?.subscriptionId ?? null
      if (newId) {
        setRegistrationState({ status: 'checking' })
      } else {
        setRegistrationState({
          status: 'missing',
          message: 'Membership course ID not assigned.'
        })
      }
      toast.success('Generated a new membership course ID.')
      router.refresh()
    } catch (error) {
      console.error('Failed to reset subscription ID', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to reset the membership course ID.'
      )
    } finally {
      setIsResettingCourseId(false)
    }
  }, [
    address,
    canRegisterOnchain,
    group._id,
    resetSubscriptionIdMutation,
    router
  ])

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (values: GroupSettingsValues) => {
    if (!address) {
      toast.error('Connect your wallet to update settings.')
      return
    }

    try {
      setIsSaving(true)

      // Prevent owner from being added as admin explicitly
      if (ownerAddress) {
        let ownerConflict = false
        values.administrators?.forEach((admin, index) => {
          const normalized = admin.walletAddress.trim().toLowerCase()
          if (normalized === ownerAddress) {
            form.setError(
              `administrators.${index}.walletAddress` as const,
              {
                type: 'manual',
                message:
                  'The group owner receives the remaining share automatically. Remove this wallet to continue.'
              }
            )
            ownerConflict = true
          }
        })
        if (ownerConflict) {
          setIsSaving(false)
          return
        }
      }

      const priceRaw =
        values.billingCadence === 'monthly' && values.price
          ? Number(values.price)
          : 0

      const parsedPrice = Number.isFinite(priceRaw) ? Math.max(0, priceRaw) : 0

      const thumbnailSource = normalizeMediaInput(values.thumbnailUrl)

      const gallery = (values.galleryUrls ?? [])
        .map(url => normalizeMediaInput(url))
        .filter(Boolean) as string[]

      const tags = values.tags
        ?.split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean)

      const resolvedVisibility =
        values.billingCadence === 'monthly' ? 'private' : values.visibility

      const administratorPayload = (
        values.administrators?.map(admin => {
          const wallet = admin.walletAddress.trim()
          const shareNumeric = Number(admin.share)
          if (!wallet || Number.isNaN(shareNumeric) || shareNumeric <= 0) {
            return null
          }
          return {
            walletAddress: wallet,
            shareBps: Math.round(shareNumeric * 100)
          }
        }) ?? []
      ).filter(
        (
          admin
        ): admin is { walletAddress: string; shareBps: number } => admin !== null
      )

      if (administratorPayload.length > 0) {
        const totalBps = administratorPayload.reduce(
          (total, admin) => total + admin.shareBps,
          0
        )
        if (totalBps > 10000) {
          const diff = totalBps - 10000
          const last = administratorPayload[administratorPayload.length - 1]
          last.shareBps = Math.max(0, last.shareBps - diff)
        }
      }

      const normalizedAdministrators = administratorPayload.filter(
        admin => admin.shareBps > 0
      )

      await updateSettings({
        id: group._id,
        ownerAddress: address,
        shortDescription: values.shortDescription?.trim(),
        aboutUrl: values.aboutUrl?.trim() || undefined,
        thumbnailUrl: thumbnailSource || undefined,
        galleryUrls: gallery,
        tags,
        visibility: resolvedVisibility,
        billingCadence: parsedPrice > 0 ? 'monthly' : values.billingCadence,
        price: parsedPrice,
        administrators: normalizedAdministrators
      })

      toast.success('Group settings updated')
      router.refresh()
    } catch (error) {
      console.error('Failed to update group settings', error)
      toast.error('Unable to save settings. Please retry.')
    } finally {
      setIsSaving(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Subscription card */}
        <div className={subscriptionCardClasses}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Platform subscription
              </h3>
              <p className="text-xs text-muted-foreground">
                {subscriptionCardDescription}{' '}
                Pay {platformFeeLabel} in {NATIVE_TOKEN_SYMBOL} to extend
                access for 30 days.
              </p>
            </div>
            <div className="text-xs text-muted-foreground sm:text-right">
              <div className="font-mono text-sm text-foreground">
                {subscription.isExpired ? 'Expired' : 'Renews'}{' '}
                {subscriptionRenewalLabel}
              </div>
              {subscriptionLastPaidLabel && (
                <div>Last paid {subscriptionLastPaidLabel}</div>
              )}
              {subscription.daysRemaining !== null &&
                !subscription.isExpired && (
                  <div>
                    {subscription.daysRemaining} day
                    {subscription.daysRemaining === 1 ? '' : 's'} remaining
                  </div>
                )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={handleRenewSubscription}
              disabled={isSubscriptionRenewing}
              className="inline-flex items-center gap-2 self-start sm:self-auto"
              style={{ backgroundColor: ZIPHER, color: '#0b0b0b' }}
            >
              <RefreshCcw className="h-4 w-4" />
              {isSubscriptionRenewing ? 'Processing…' : 'Renew subscription'}
            </Button>
          </div>
        </div>

        {/* Summary section */}
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-border/10">
          <h3 className="text-sm font-semibold text-foreground">
            Group summary
          </h3>
          <p className="text-xs text-muted-foreground">
            Update the public summary and intro link for your encrypted
            community.
          </p>

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Briefly describe what this encrypted space is about."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between text-xs text-muted-foreground">
                  <span>Max 200 characters</span>
                  <span>{(field.value?.length ?? 0).toString()} / 200</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aboutUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intro / demo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Public-facing intro or demo link for your community.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Media section */}
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-border/10">
          <h3 className="text-sm font-semibold text-foreground">
            Media & encryption
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage your thumbnail and gallery. Uploaded files are stored via
            Convex and referenced as storage IDs.
          </p>

          <GroupMediaFields
            form={form}
            requestUploadUrl={requestUploadUrl}
            initialMedia={mediaSnapshot}
          />
        </div>

        {/* Discovery & access */}
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-border/10">
          <h3 className="text-sm font-semibold text-foreground">
            Discovery & access
          </h3>
          <p className="text-xs text-muted-foreground">
            Control how members discover and access this encrypted community.
          </p>

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="encryption, zama, ml, ai" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Comma-separated tags help discovery (for public groups).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={billingCadence === 'monthly'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="public"
                        disabled={billingCadence === 'monthly'}
                      >
                        Public
                      </SelectItem>
                      <SelectItem value="private">
                        Private (recommended for encrypted content)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Private spaces gate access using FH-EVM and database
                    membership.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing cadence */}
            <FormField
              control={form.control}
              name="billingCadence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership model</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={value => {
                      field.onChange(value)
                      if (value === 'free') {
                        form.setValue('price', '', {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose pricing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="monthly">Paid (Monthly)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Paid spaces require private access gating and a registered
                    membership course on-chain.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price */}
          {form.watch('billingCadence') === 'monthly' && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="49.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Members are billed this amount each month; it is converted
                    to {NATIVE_TOKEN_SYMBOL} during checkout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Administrators & revenue split */}
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-border/10">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Administrators & revenue sharing
              </h3>
              <p className="text-xs text-muted-foreground">
                Add collaborators who receive a share of membership revenue.
                Remaining share stays with the group owner.
              </p>
            </div>

            <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Owner share:{' '}
              <span className="font-semibold text-foreground">
                {ownerShare.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {fields.length > 0 ? (
              <div className="space-y-2">
                {fields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="grid gap-3 rounded-xl border border-border bg-card/60 p-3 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_auto]"
                  >
                    <FormField
                      control={form.control}
                      name={`administrators.${index}.walletAddress`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Wallet address
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`administrators.${index}.share`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Share (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No additional administrators configured yet.
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  walletAddress: '',
                  share: ''
                })
              }
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add administrator
            </Button>

            <p className="text-[11px] text-muted-foreground">
              The group owner automatically receives the remaining share after
              administrator percentages are applied.
            </p>
          </div>
        </div>

        {/* On-chain course registration */}
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-border/10">
          <h3 className="text-sm font-semibold text-foreground">
            On-chain membership course
          </h3>
          <p className="text-xs text-muted-foreground">
            This controls FH-EVM membership gating and recurring paid access for
            your encrypted group.
          </p>

          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="space-y-1">
              <div className="font-mono text-sm text-foreground">
                Course ID: {courseIdDisplay}
              </div>
              <div className="text-muted-foreground">
                Status: {registrationStatusText}
              </div>
              <p className="mt-1 text-muted-foreground">
                {registrationDescription}
              </p>
            </div>

            <div className="flex flex-col items-start justify-end gap-2 sm:items-end">
              {showRegistrationButton && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRegisterCourse}
                  disabled={isRegisteringCourse}
                  className="w-full sm:w-auto"
                >
                  {isRegisteringCourse
                    ? 'Registering…'
                    : registrationActionLabel}
                </Button>
              )}

              {canResetCourseId && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleResetCourseId}
                  disabled={isResettingCourseId}
                  className="w-full sm:w-auto"
                >
                  {isResettingCourseId ? 'Resetting…' : 'Reset course ID'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
          >
            {isSaving ? 'Saving changes…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
