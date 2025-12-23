'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Address } from 'viem'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import {
  NATIVE_TOKEN_SYMBOL,
  ZIPHER_CHAIN_ID
} from '@/lib/config'

import { ADDRESSES } from '@/lib/onchain/contracts'
import { publicClient } from '@/lib/onchain/network'

import { MembershipPassService } from '@/lib/onchain/services/membershipPassService'
import { MarketplaceService } from '@/lib/onchain/services/marketplaceService'

import { parseNativeTokenAmount } from '@/lib/native-token'
import { formatTimestampRelative } from '@/lib/time'
import { useGroupContext } from '../context/group-context'
import { resolveMembershipCourseId } from '../utils/membership'
import { formatGroupPriceLabel } from '../utils/price'

// ✅ NEW WALLET HOOK (replaces usePushAccount)
import { useWallet } from '@/lib/web3/WalletProvider'

// KEEP YOUR SAME HOOK
import { useTokenUsdRate } from '@/hooks/use-token-usd-rate'

/* ------------------------------ ZIPHER THEME ------------------------------ */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BG = 'rgba(247, 201, 72, 0.12)'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.28)'

/* ========================================================================== */
/*                      JOIN GROUP BUTTON (ZIPHER THEME)                      */
/* ========================================================================== */

type JoinPreparation = {
  requiresPayment: boolean
  skipPayment: boolean
  courseId: bigint | null
  amount: bigint
}

export function JoinGroupButton() {
  const { group, owner, isOwner, isMember, membership } = useGroupContext()
  const { address, walletClient, chainId } = useWallet()
  const pc = publicClient()
  // Determine which network to use
  

  const joinGroup = useMutation(api.groups.join)

  const [isPreparing, setIsPreparing] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [pendingJoin, setPendingJoin] = useState<JoinPreparation | null>(null)

  const { rate: pushUsdRate, refresh: refreshPushUsdRate } =
    useTokenUsdRate('push-protocol', {
      autoFetch: true,
      fallbackRate: 1
    })

  const membershipService = useMemo(() => {
  if (
    !ADDRESSES.MEMBERSHIP ||
    ADDRESSES.MEMBERSHIP === "0x0000000000000000000000000000000000000000"
  ) return null;

  return new MembershipPassService({
   address: ADDRESSES.MEMBERSHIP
  });
}, [])

const marketplaceService = useMemo(() => {
  if (
    !ADDRESSES.MARKETPLACE ||
    ADDRESSES.MARKETPLACE === '0x0000000000000000000000000000000000000000'
  ) return null

  return new MarketplaceService({
    address: ADDRESSES.MARKETPLACE
  })
}, [])

  const membershipCourseId = useMemo(
    () => resolveMembershipCourseId(group),
    [group]
  )

  const blockchainAddress = address as `0x${string}` | null
  const backendAddress = address as `0x${string}` | null

  /* --------------------------- PREPARE JOIN LOGIC -------------------------- */

  const prepareJoin = useCallback(async (): Promise<JoinPreparation | null> => {
    if (!blockchainAddress) {
      toast.error('Please connect your wallet.')
      return null
    }

    if (!owner?.walletAddress) {
      toast.error('Group owner not found.')
      return null
    }

    const price = group.price ?? 0
    const requiresPayment = price > 0
    let skipPayment = false

  
    // Detect existing pass via ERC-1155 balance
if (
  requiresPayment &&
  membershipService &&
  membershipCourseId
) {
  try {
    const passBalance = await membershipService.balanceOf(
      blockchainAddress as Address,
      membershipCourseId
    )

    if ((passBalance as bigint) > 0n) {
      skipPayment = true
    }
  } catch (err) {
    console.error('Pass balance check error:', err)
}
}

    const amount =
      requiresPayment && !skipPayment
        ? parseNativeTokenAmount((group.price ?? 0).toString())
        : 0n

    // Balance check
    if (requiresPayment && !skipPayment) {
      const nativeBalance = await pc.getBalance({
        address: blockchainAddress as Address
      }) as bigint

      if (nativeBalance < amount) {
        toast.error(`Insufficient ${NATIVE_TOKEN_SYMBOL} to join.`)
        return null
      }
    }

    return {
      requiresPayment,
      skipPayment,
      courseId: membershipCourseId,
      amount
    }
  }, [
    blockchainAddress,
    group.price,
    membershipCourseId,
    membershipService,
    marketplaceService,
    owner?.walletAddress,
    walletClient
  ])

  /* ---------------------------- FINALIZE JOIN ----------------------------- */

 const finalizeJoin = useCallback(
  async (prep: JoinPreparation) => {
    if (!backendAddress) {
      toast.error('Connect your wallet to continue.')
      return
    }

    let txHash: `0x${string}` | undefined

    try {
      setIsFinalizing(true)

      if (prep.requiresPayment && !prep.skipPayment) {
        if (!marketplaceService || !prep.courseId) {
          toast.error('Marketplace not ready.')
          return
        }

        const tx = await marketplaceService.purchasePrimary(
	 walletClient,
	 blockchainAddress as Address,
	 prep.courseId,
	 prep.amount
	)

        txHash = tx as `0x${string}`
      }

      await joinGroup({
        groupId: group._id,
        memberAddress: backendAddress,
        txHash,
        hasActivePass: prep.skipPayment
      })

      toast.success('Welcome to the group!')
    } catch (err) {
      console.error(err)
      toast.error('Joining failed.')
    } finally {
      setIsFinalizing(false)
      setPendingJoin(null)
      setConfirmationOpen(false)
    }
  },
  [
    backendAddress,
    group._id,
    joinGroup,
    marketplaceService,
    walletClient
  ]
)         

  /* ----------------------------- BUTTON STATES ---------------------------- */

  if (isOwner) {
    return (
      <Button
        className="w-full font-semibold"
        style={{ background: ZIPHER_GOLD_BG, borderColor: ZIPHER_GOLD_BORDER }}
        variant="secondary"
        disabled
      >
        You own this group
      </Button>
    )
  }

  if (isMember) {
    return (
      <LeaveGroupButton
        membershipService={membershipService}
        courseId={membershipCourseId}
      />
    )
  }

  const handleJoin = async () => {
    setIsPreparing(true)
    try {
      const prep = await prepareJoin()
      if (!prep) return

      if (prep.requiresPayment && !prep.skipPayment) {
        setPendingJoin(prep)
        await refreshPushUsdRate()
        setConfirmationOpen(true)
      } else {
        await finalizeJoin(prep)
      }
    } finally {
      setIsPreparing(false)
    }
  }

  const busy = isPreparing || isFinalizing
  const priceLabel = formatGroupPriceLabel(group.price, group.billingCadence, {
    includeCadence: true
  })

  const ctaLabel = group.price ? `Join ${priceLabel}` : 'Join for free'

  /* ------------------------------ UI — BUTTON ------------------------------ */

  return (
    <>
      <Button
        onClick={handleJoin}
        disabled={busy}
        className="w-full font-semibold uppercase transition-all"
        style={{
          background: ZIPHER_GOLD,
          color: '#111',
          borderColor: ZIPHER_GOLD
        }}
      >
        {busy ? 'Processing...' : ctaLabel}
      </Button>

      {/* PAYMENT CONFIRMATION MODAL */}
      <Dialog
        open={confirmationOpen}
        onOpenChange={(open) => {
          if (!open) setPendingJoin(null)
          setConfirmationOpen(open)
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          style={{ borderColor: ZIPHER_GOLD_BORDER }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">
              Confirm membership payment
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-600">
              Your membership will be processed on-chain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div
              className="rounded-md p-3 flex items-center justify-between"
              style={{
                background: ZIPHER_GOLD_BG,
                border: `1px solid ${ZIPHER_GOLD_BORDER}`
              }}
            >
              <span className="text-sm font-medium text-neutral-700">
                Billing amount
              </span>
              <span className="text-sm font-bold text-black">{priceLabel}</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmationOpen(false)}
              disabled={isFinalizing}
              style={{ borderColor: ZIPHER_GOLD_BORDER }}
            >
              Cancel
            </Button>

            <Button
              onClick={async () =>
                pendingJoin && (await finalizeJoin(pendingJoin))
              }
              disabled={isFinalizing}
              style={{
                background: ZIPHER_GOLD,
                color: '#111',
                borderColor: ZIPHER_GOLD
              }}
            >
              {isFinalizing ? 'Processing...' : 'Pay & join'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ========================================================================== */
/*                           LEAVE BUTTON (THEMED)                            */
/* ========================================================================== */

function LeaveGroupButton({
  membershipService,
  courseId
}: {
  membershipService: MembershipPassService | null
  courseId: bigint | null
}) {
  const { group, membership } = useGroupContext()
  const { address } = useWallet()
  const leaveGroup = useMutation(api.groups.leave)

  const [open, setOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const blockchainAddress = address as `0x${string}` | null
  const backendAddress = address as `0x${string}` | null

  const isFree = (group.price ?? 0) === 0

  const handleLeave = async () => {
    if (!backendAddress) {
      toast.error('Please connect wallet.')
      return
    }

    try {
      setIsLeaving(true)
      await leaveGroup({
        groupId: group._id,
        memberAddress: backendAddress
      })
      toast.success('You left this group.')
      setOpen(false)
    } catch {
      toast.error('Unable to leave.')
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <>
      <Button
        className="w-full font-semibold uppercase"
        variant="outline"
        onClick={() => setOpen(true)}
        style={{ borderColor: ZIPHER_GOLD_BORDER }}
      >
        Leave group
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: ZIPHER_GOLD_BORDER }}>
          <DialogHeader>
            <DialogTitle className="font-semibold text-black">
              Leave {group.name}?
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-600">
              You will lose access immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isLeaving}
              style={{
                background: ZIPHER_GOLD,
                color: '#111',
                borderColor: ZIPHER_GOLD
              }}
            >
              {isLeaving ? 'Leaving...' : 'Confirm leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
