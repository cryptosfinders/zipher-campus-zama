// frontend/lib/pricing/platform-fee.ts
import type { PublicClient } from 'viem'
import { formatNativeToken } from '@/lib/native-token'
import {
  PLATFORM_FEE_BPS,
  PLATFORM_MIN_FEE_WEI
} from '@/lib/config'

export type PlatformFeeQuote = {
  amountWei: bigint
  displayAmount: string
}

type ResolveQuoteOptions = {
  /**
   * Optional subtotal (eg. course price) to compute a % fee from.
   * If omitted, only PLATFORM_MIN_FEE_WEI applies.
   */
  subtotalWei?: bigint
  treasuryAddress: `0x${string}`
}

/**
 * Compute platform fee in wei using env-driven rules:
 * - PERCENT (PLATFORM_FEE_BPS) of subtotal
 * - floored to PLATFORM_MIN_FEE_WEI
 */
export async function resolvePlatformFeeQuote(
  opts: ResolveQuoteOptions
): Promise<PlatformFeeQuote> {
  const base = opts.subtotalWei ?? 0n

  let amount = 0n

  if (PLATFORM_FEE_BPS > 0 && base > 0n) {
    amount = (base * BigInt(PLATFORM_FEE_BPS)) / 10_000n
  }

  if (PLATFORM_MIN_FEE_WEI > 0n && amount < PLATFORM_MIN_FEE_WEI) {
    amount = PLATFORM_MIN_FEE_WEI
  }

  const displayAmount = formatNativeToken(amount)

  return {
    amountWei: amount,
    displayAmount
  }
}

type BalanceCheckResult =
  | { ok: true; reason: '' }
  | { ok: false; reason: string }

export async function validatePlatformFeeBalance(opts: {
  quote: PlatformFeeQuote
  userAddress: `0x${string}`
  publicClient: Pick<PublicClient, 'getBalance'>
}): Promise<BalanceCheckResult> {
  const balance = await opts.publicClient.getBalance({
    address: opts.userAddress
  })

  if (balance < opts.quote.amountWei) {
    return {
      ok: false,
      reason: 'Insufficient balance to pay platform fee.'
    }
  }

  return { ok: true, reason: '' }
}

