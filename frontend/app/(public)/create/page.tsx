// app/(public)/create/page.tsx
'use client'

import { useCallback, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { calculateFheFee } from "@/lib/fhe-pricing";
import { useChainId, useWriteContract } from 'wagmi'

import { createGroupSchema } from '@/features/groups/schemas/create-group-schema'
import type { CreateGroupFormValues } from '@/features/groups/schemas/create-group-schema'
import { sepolia } from 'wagmi/chains'

import { Logo } from '@/components/layout/logo'
import { ChainIndicator } from '@/components/layout/chain-indicator'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { api } from '@/convex/_generated/api'
import {
  MEMBERSHIP_DURATION_SECONDS,
  MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS,
  PLATFORM_TREASURY_ADDRESS
} from '@/lib/config'
import { registrarAbi } from '@/lib/onchain/abi'
import {
  publicClient,
  ACTIVE_CHAIN_ID,
  ACTIVE_CHAIN_ID_HEX,
  ACTIVE_CHAIN_NAME,
  ACTIVE_NATIVE_SYMBOL,
  ACTIVE_RPC_URL,
  ACTIVE_BLOCK_EXPLORER_URL
} from '@/lib/onchain/network'
import { ADDRESSES } from '@/lib/onchain/contracts'

import { parseNativeTokenAmount } from '@/lib/native-token'
import { GroupMediaFields } from '@/features/groups/components/group-media-fields'
import { generateMembershipCourseId } from '@/features/groups/utils/membership'
import {
  isValidMediaReference,
  normalizeMediaInput
} from '@/features/groups/utils/media'
import { useAppRouter } from '@/hooks/use-app-router'
import { usePlatformFeeQuote } from '@/hooks/use-platform-fee-quote'
import type { PlatformFeeQuote } from '@/lib/pricing/platform-fee'
import { validatePlatformFeeBalance } from '@/lib/pricing/platform-fee'

import { useWallet } from '@/lib/web3/WalletProvider'
import { encryptedCampus } from '@/lib/encrypted-campus-instance'

/* -------------------------------------------------------------------------- */
/*                                Wallet helpers                              */
/* -------------------------------------------------------------------------- */

async function switchOrAddActiveChain() {
  if (typeof window === 'undefined') throw new Error('No window')
  const eth: any = (window as any).ethereum
  if (!eth?.request) throw new Error('Wallet provider not found')

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ACTIVE_CHAIN_ID_HEX }]
    })
  } catch (err: any) {
    // 4902 = chain not added yet
    if (err?.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: ACTIVE_CHAIN_ID_HEX,
            chainName: ACTIVE_CHAIN_NAME,
            rpcUrls: [ACTIVE_RPC_URL],
            nativeCurrency: {
              name: ACTIVE_NATIVE_SYMBOL,
              symbol: ACTIVE_NATIVE_SYMBOL,
              decimals: 18
            },
            blockExplorerUrls: ACTIVE_BLOCK_EXPLORER_URL
              ? [ACTIVE_BLOCK_EXPLORER_URL]
              : undefined
          }
        ]
      })
    } else {
      throw err
    }
  }
}

async function sendNativeTx(params: {
  from: `0x${string}`
  to: `0x${string}`
  valueWei: bigint
  data?: `0x${string}` | undefined
}): Promise<`0x${string}`> {
  if (typeof window === 'undefined') throw new Error('No window')
  const eth: any = (window as any).ethereum
  if (!eth?.request) throw new Error('Wallet provider not found')

  const valueHex =
    params.valueWei && params.valueWei > 0n
      ? `0x${params.valueWei.toString(16)}`
      : '0x0'

  const txHash = (await eth.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: params.from,
        to: params.to,
        value: valueHex,
        data: params.data ?? '0x'
      }
    ]
  })) as `0x${string}`

  return txHash
}

/* -------------------------------------------------------------------------- */
/*                                Validation                                  */
/* -------------------------------------------------------------------------- */    

const DEFAULT_VALUES: CreateGroupFormValues = {
  name: '',
  shortDescription: '',
  aboutUrl: '',
  thumbnailUrl: '',
  galleryUrls: [],
  tags: '',
  visibility: 'private',
  billingCadence: 'free',
  price: ''
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function Create() {
  const router = useAppRouter()
  const { address, connect } = useWallet()
  const chainId = useChainId()
  const wrongChain = !!chainId && chainId !== ACTIVE_CHAIN_ID
  const { feeFhe, feeUsd } = calculateFheFee();

  const { writeContractAsync } = useWriteContract()

  const { quote: cachedPlatformFeeQuote, refresh: refreshPlatformFee } =
    usePlatformFeeQuote()

  const createGroup = useMutation(api.groups.create)
  const generateUploadUrl = useMutation(api.media.generateUploadUrl)
  const submitEncryptedCourse = useMutation(api.encryptedCourses.submit)

  const requestUploadUrl = useCallback(
    async () => {
      if (!address) {
        throw new Error('Connect your wallet before uploading media.')
      }

      const result = await generateUploadUrl({})
      return result.uploadUrl as string
    },
    [address, generateUploadUrl]
  )

  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [pendingValues, setPendingValues] =
    useState<CreateGroupFormValues | null>(null)
  const [pendingQuote, setPendingQuote] = useState<PlatformFeeQuote | null>(
    () => cachedPlatformFeeQuote ?? null
  )
  const [isFinalizing, setIsFinalizing] = useState(false)

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: DEFAULT_VALUES
  })

  const billingCadence = form.watch('billingCadence')
  const isProcessing = form.formState.isSubmitting || isFinalizing

  const handleCancelConfirmation = () => {
    setConfirmationOpen(false)
    setPendingValues(null)
    setPendingQuote(null)
  }

  /* ------------------------------------------------------------------------ */
  /*                             CORE SUBMIT LOGIC                            */
  /* ------------------------------------------------------------------------ */

  const performCreation = useCallback(
    async (values: CreateGroupFormValues, feeQuote: PlatformFeeQuote) => {
      const client = publicClient()
      let txHash: `0x${string}` | null = null

      // Ensure wallet connected
      let currentAddress = address as `0x${string}` | null

      if (typeof window === 'undefined') {
        toast.error('Wallet is only available in the browser')
        return
      }

      const eth: any = (window as any).ethereum

      if (!currentAddress) {
        try {
          await connect()
          const accounts: string[] =
            (await eth?.request?.({ method: 'eth_accounts' })) ?? []
          currentAddress = (accounts[0] ?? null) as `0x${string}` | null
        } catch {
          toast.error('Connect your wallet to continue')
          return
        }
      }

      if (!currentAddress) {
        toast.error('Wallet address unavailable')
        return
      }

      const registrarAddress = ADDRESSES.REGISTRAR as `0x${string}`
      const treasuryAddress = PLATFORM_TREASURY_ADDRESS as `0x${string}`

      if (
        !registrarAddress ||
        registrarAddress ===
          '0x0000000000000000000000000000000000000000'
      ) {
        toast.error('Registrar contract address not configured')
        return
      }

      if (
        !treasuryAddress ||
        treasuryAddress ===
          '0x0000000000000000000000000000000000000000'
      ) {
        toast.error('Treasury address not configured')
        return
      }

      /* ------------ Validate platform fee balance on ACTIVE chain ---------- */

      const feeAmount = feeQuote?.amountWei ?? 0n

      if (feeAmount > 0n) {
        try {
          const balanceCheck = await validatePlatformFeeBalance({
            quote: feeQuote,
            userAddress: currentAddress,
            publicClient: client
          })

          if (!balanceCheck.ok) {
            toast.error(balanceCheck.reason)
            return
          }
        } catch (err) {
          console.error('Platform fee balance validation failed', err)
          toast.error('Unable to validate platform fee balance')
          return
        }
      }

      /* ----------------------- Course / price prep ------------------------- */

      const priceString =
        values.billingCadence === 'monthly' && values.price
          ? values.price.trim()
          : ''
      const formattedPrice =
        priceString !== '' ? Math.max(Number(priceString), 0) : 0
      const membershipPriceAmount =
        priceString !== '' ? parseNativeTokenAmount(priceString) : 0n

      const courseIdStr = generateMembershipCourseId()
      const courseId = BigInt(courseIdStr)

      // 🟩 We'll also derive a group label used for encryptedCampus
      const groupLabel = `space-${courseIdStr}`

      /* ------------ Preflight registrar.marketplace on ACTIVE chain -------- */

      let registrarMarketplace: `0x${string}` | null = null

try {
  const marketplace = await client.readContract({
    address: registrarAddress,
    abi: registrarAbi,
    functionName: 'marketplace',
  } as any)

  registrarMarketplace = marketplace as `0x${string}`
} catch (err) {
  console.error('Failed to read registrar.marketplace', err)
}

      if (
        !registrarMarketplace ||
        registrarMarketplace ===
          '0x0000000000000000000000000000000000000000'
      ) {
        toast.error(
          'Registrar is not configured with a marketplace. Contact admin.'
        )
        return
      }

      /* ----------------- Simulation for registerCourse --------------------- */

      try {
        await client.simulateContract({
          address: registrarAddress,
          abi: registrarAbi,
          functionName: 'registerCourse',
          args: [
            courseId,
            membershipPriceAmount,
            [currentAddress as `0x${string}`],
            [10000],
            BigInt(MEMBERSHIP_DURATION_SECONDS),
            BigInt(MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS)
          ],
          account: currentAddress as `0x${string}`
        })
      } catch (err: any) {
        console.error('Simulation failed', err)
        toast.error(
          err?.shortMessage ??
            'Registrar rejected registration. Check on-chain configuration.'
        )
        return
      }

      /* ---------------------- Switch wallet to chain ----------------------- */

      try {
        await switchOrAddActiveChain()
      } catch (err: any) {
        console.error('Failed to switch chain', err)
        toast.error(err?.message ?? 'Failed to switch network in wallet')
        return
      }

      /* ------------------ Platform fee payment (ACTIVE chain) -------------- */

      if (feeAmount > 0n) {
        try {
          const feeTxHash = await sendNativeTx({
            from: currentAddress,
            to: treasuryAddress,
            valueWei: feeAmount
          })

          txHash = feeTxHash
          void refreshPlatformFee()
        } catch (err: any) {
          console.error('Platform fee payment failed', err)
          toast.error(err?.shortMessage ?? 'Fee payment failed')
          return
        }
      }

      /* ------------------------ Registration tx ---------------------------- */

      try {
        const regTx = await writeContractAsync({
          chain: sepolia,
          account: currentAddress,
          address: registrarAddress,
          abi: registrarAbi,
          functionName: 'registerCourse',
          args: [
            courseId,
            membershipPriceAmount,
            [currentAddress],
            [10000],
            BigInt(MEMBERSHIP_DURATION_SECONDS),
            BigInt(MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS)
          ]
        })

        txHash = regTx as `0x${string}`
      } catch (err: any) {
        console.error('Registrar tx failed', err)
        toast.error(
          err?.shortMessage ?? 'Failed to register course on-chain.'
        )
        return
      }

      /* ---------------- Convex: persist encrypted space metadata ---------- */

      const resolvedVisibility =
        formattedPrice > 0 ? 'private' : values.visibility

      const thumbnailSource = normalizeMediaInput(values.thumbnailUrl)
      const gallery = (values.galleryUrls ?? [])
        .map((v) => normalizeMediaInput(v))
        .filter(Boolean)
      const tags =
        values.tags
          ?.split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean) ?? []

      const groupId = await createGroup({
        ownerAddress: currentAddress,
        name: values.name.trim(),
        shortDescription: values.shortDescription.trim(),
        aboutUrl: normalizeMediaInput(values.aboutUrl) || undefined,
        thumbnailUrl: thumbnailSource || undefined,
        galleryUrls: gallery.length ? gallery : undefined,
        tags,
        visibility: resolvedVisibility,
        billingCadence:
          formattedPrice > 0 ? 'monthly' : values.billingCadence,
        price: formattedPrice,
        subscriptionId: courseIdStr,
        subscriptionPaymentTxHash: txHash ?? undefined
      } as any)
      /* ------------------------------------------------------ */
/* 🏪 Create encrypted marketplace listing (PAID ONLY)     */
/* ------------------------------------------------------ */
if (formattedPrice > 0) {
  await submitEncryptedCourse({
    ciphertext: `ENCRYPTED_GROUP:${groupId}`,
    address: currentAddress,
    groupId,
  });
}
      /* ------------------------------------------------------ */
      /* 🔐 Encrypted Membership Sync into FHE Contract          */
      /* ------------------------------------------------------ */
     // try {
       // await encryptedCampus.setMembershipPlain({
         // groupLabel,
         // user: currentAddress,
         // isActive: true
       // })
     // } catch (err) {
       // console.error('Encrypted membership sync failed', err)
       // toast.error(
         // 'Encrypted membership sync failed. Space created but FHE sync incomplete.'
        //)
     // }

      toast.success('Encrypted space created!')
      router.push(`/${groupId}/about`)
    },
    [address, connect, createGroup, router, refreshPlatformFee, writeContractAsync]
  )

  /* -------------------------------------------------------------------------- */
  /*                               SUBMIT HANDLER                               */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (values: CreateGroupFormValues) => {
    try {
      const quote = await refreshPlatformFee()
      setPendingValues(values)
      setPendingQuote(quote ?? null)
      setConfirmationOpen(true)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message ?? 'Unable to resolve platform fee')
    }
  }

  const handleConfirmSubmission = async () => {
    if (!pendingValues || !pendingQuote) return

    setConfirmationOpen(false)
    setIsFinalizing(true)
    try {
      await performCreation(pendingValues, pendingQuote)
    } finally {
      setIsFinalizing(false)
      setPendingValues(null)
      setPendingQuote(null)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Decorative gold glows (brand: Zipher gold) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(245,183,0,0.12),transparent_65%)] blur-3xl" />
          <div className="absolute -right-4 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(255,106,0,0.10),transparent_65%)] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(245,183,0,0.08),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1" />
              <div className="flex flex-col items-center gap-3">
                <Logo className="text-2xl" />
                <ChainIndicator />
              </div>
              <div className="flex-1" />
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-foreground via-[#F5B700] to-[#FF6A00] bg-clip-text text-transparent">
                Create an Encrypted Learning Space
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Deploy a privacy-first, encrypted community powered by{' '}
              <strong>Zama FHE</strong> for private compute and on-chain
              access control. Students access content while encryption and
              compute happen offchain — you control access onchain.
            </p>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-3xl">
            {/* Platform / Encrypted Compute Fee banner */}
            <div className="mb-8 rounded-2xl border border-border/50 bg-card/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Platform &amp; Encrypted-Compute Fee
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                   {feeFhe.toFixed(2)} FHE
                  </p>
                 <p className="text-xs text-muted-foreground">
                 ≈ ${feeUsd.toFixed(2)} USD estimated compute
                 </p>
                </div>
                <div className="rounded-full bg-[#F5B700]/10 px-4 py-2 text-sm font-semibold text-[#F5B700]">
                  Includes Zama FHE credit
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                This fee covers hosting, on-chain registrar registration,
                and optional Zama encrypted compute credits to run private
                transforms on your content.
              </p>
            </div>

            {/* Helpful features */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '🔒',
                  title: 'End-to-End Encrypted',
                  desc: 'Content encrypted at rest & in compute'
                },
                {
                  icon: '🧠',
                  title: 'Zama FHE Compute',
                  desc: 'Private transforms with encrypted compute'
                },
                {
                  icon: '⛓️',
                  title: 'On-Chain Gating',
                  desc: 'On-chain access control & memberships'
                },
                {
                  icon: '💳',
                  title: 'Universal Payments',
                  desc: 'Accept many tokens via universal wallet'
                },
                {
                  icon: '🎓',
                  title: 'Built-In Classroom',
                  desc: 'Courses, lessons, and credentials'
                },
                {
                  icon: '🚀',
                  title: 'Deploy & Scale',
                  desc: 'One deployment — multi-chain reach'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-[#F5B700]/40 hover:bg-card/80 hover:shadow-md hover:shadow-[#F5B700]/5"
                >
                  <div className="mb-2 text-2xl">{feature.icon}</div>
                  <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-[#F5B700]">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-[#F5B700]/20 bg-card/80 p-8 shadow-2xl shadow-[#F5B700]/5 backdrop-blur-xl md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Encrypted Space Details
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure your encrypted learning space. Content uploaded
                  to this space is expected to be encrypted; you can enable
                  Zama FHE transforms for private indexing or evaluation.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Space name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Confidential AI Study Group"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between text-xs text-muted-foreground">
                          <span>Max 200 characters</span>
                          <span>
                            {(field.value?.length ?? 0).toString()} / 200
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Short description */}
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Short description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="What makes this space private and valuable?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between text-xs text-muted-foreground">
                          <span>20-200 characters</span>
                          <span>
                            {(field.value?.length ?? 0).toString()} / 200
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Visibility + Billing */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Visibility */}
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Visibility
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={billingCadence === 'monthly'}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
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
                            Private spaces encrypt content; access is gated
                            on-chain.
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
                          <FormLabel className="text-sm font-semibold">
                            Membership model
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value === 'free') {
                                form.setValue('price', '')
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Choose pricing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="monthly">
                                Paid (Monthly)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            Paid spaces require private access gating.
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
                          <FormLabel className="text-sm font-semibold">
                            Monthly price (USD)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="49.00"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Members are billed this USD amount each month; it's
                            converted to the connected chain&apos;s native
                            token during checkout.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Media & Encryption */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Media &amp; Encryption
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Upload thumbnails &amp; gallery images. Content you add to
                      the space should be encrypted client-side. Optionally
                      enable Zama FHE transforms for private compute (indexing,
                      embeddings, evaluation).
                    </p>
                    <GroupMediaFields
                      form={form}
                      requestUploadUrl={requestUploadUrl}
                    />
                  </div>

                  {/* About URL */}
                  <FormField
                    control={form.control}
                    name="aboutUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Intro / Demo video URL (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/watch?v=..."
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Link a demo or intro video. Keep private content off
                          public video platforms where possible.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Tags (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="encryption, zama, ml, ai"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Comma-separated tags help discovery (for public
                          spaces).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      onClick={async (e) => {
                        if (wrongChain) {
                          e.preventDefault()
                          try {
                            await switchOrAddActiveChain()
                            toast.success(`Switched to ${ACTIVE_CHAIN_NAME}`)
                          } catch (err: any) {
                            toast.error(
                              err?.message ?? 'Failed to switch network'
                            )
                          }
                        }
                      }}
                      className="h-12 w-full bg-gradient-to-r from-[#F5B700] to-[#FF6A00] text-black text-base font-semibold uppercase tracking-wide hover:opacity-90 shadow-lg shadow-[#F5B700]/20"
                      size="lg"
                    >
                      {isProcessing
                        ? 'Creating Encrypted Space…'
                        : 'Create Encrypted Space'}
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      By creating this space you accept Zipher Campus Zama
                      terms. On-chain registration and platform fee will be
                      charged during creation.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT CONFIRMATION MODAL */}
      <Dialog
        open={confirmationOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelConfirmation()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm platform &amp; compute fee</DialogTitle>
            <DialogDescription>
              This charges the platform fee and optional Zama
              encrypted-compute credit needed to enable private transforms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Billing amount
              </span>
              <span className="text-sm font-semibold text-foreground">
                {String(
                  pendingQuote?.displayAmount ??
                    cachedPlatformFeeQuote?.displayAmount ??
                    'Resolving…'
                )}
              </span>
            </div>

            <div className="rounded-lg border border-dashed border-border/60 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Settlement
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {String(
                  pendingQuote?.displayAmount ??
                    cachedPlatformFeeQuote?.displayAmount ??
                    'Resolving…'
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Paid to treasury {String(PLATFORM_TREASURY_ADDRESS)}.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelConfirmation}
              disabled={isFinalizing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmission}
              disabled={isFinalizing || !pendingQuote}
            >
              {isFinalizing ? 'Processing…' : 'Pay & Create Encrypted Space'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
