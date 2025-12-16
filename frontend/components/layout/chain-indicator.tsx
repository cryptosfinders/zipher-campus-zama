'use client'

import { useAccount, useChainId } from 'wagmi'
import {
  ACTIVE_CHAIN_ID,
  ACTIVE_CHAIN_NAME,
  ACTIVE_NATIVE_SYMBOL
} from '@/lib/onchain/network'

export function ChainIndicator() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const expectedId = ACTIVE_CHAIN_ID
  const expectedName = ACTIVE_CHAIN_NAME
  const expectedSymbol = ACTIVE_NATIVE_SYMBOL

  const isUnknown = !chainId && isConnected
  const isWrong =
    !!chainId && chainId !== expectedId && isConnected
  const isOk =
    !!chainId && chainId === expectedId && isConnected

  const base =
    'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'

  let classes = 'bg-gray-100 border-gray-300 text-gray-700'
  let dot = 'bg-gray-400'
  let label = 'Not connected'

  if (!isConnected) {
    classes = 'bg-gray-100 border-gray-300 text-gray-700'
    dot = 'bg-gray-400'
    label = `Wallet not connected`
  } else if (isUnknown) {
    classes = 'bg-yellow-50 border-yellow-300 text-yellow-800'
    dot = 'bg-yellow-500'
    label = `Connected — unknown network`
  } else if (isWrong) {
    classes = 'bg-red-50 border-red-300 text-red-800'
    dot = 'bg-red-500'
    label = `Wrong network: ${chainId}`
  } else if (isOk) {
    classes = 'bg-emerald-50 border-emerald-300 text-emerald-800'
    dot = 'bg-emerald-500'

    // ⭐ NEW — CLEAN LABEL (no chainId)
    // Example: "Sepolia ETH" or "FH-EVM FHE"
    label = `${expectedName} ${expectedSymbol}`
  }

  return (
    <div className={base + ' ' + classes}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className="truncate">{label}</span>
    </div>
  )
}
