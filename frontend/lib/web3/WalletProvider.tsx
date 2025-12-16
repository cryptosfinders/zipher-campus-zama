// frontend/lib/web3/WalletProvider.tsx
'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  useState,
} from 'react'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import type { WalletClient } from 'viem'
import { toast } from 'sonner'

type WalletStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'

type WalletContextValue = {
  address: `0x${string}` | null
  chainId: number | null
  status: WalletStatus
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: string) => Promise<`0x${string}`>
  walletWarning: string | null
  walletClient: WalletClient | null
}

const WalletContext = createContext<WalletContextValue | null>(null)

type WalletProviderProps = {
  children: ReactNode
}

/* -----------------------------------------------------------
   🔎 WALLET CONFLICT DETECTION
------------------------------------------------------------ */
function detectWalletConflicts(): string | null {
  if (typeof window === 'undefined') return null
  const eth: any = (window as any).ethereum
  if (!eth) return null

  const providers = eth.providers ?? [eth]
  let hasMetaMask = false
  const conflicts: string[] = []

  for (const p of providers) {
    if (p.isMetaMask) {
      hasMetaMask = true
      continue
    }
    if (p.isRabby) conflicts.push('Rabby Wallet')
    if (p.isOkxWallet) conflicts.push('OKX Wallet')
    if (p.isCoinbaseWallet) conflicts.push('Coinbase Wallet')
    if (p.isPhantom) conflicts.push('Phantom (EVM)')
    if (p.isFrame) conflicts.push('Frame Wallet')
  }

  // Brave built-in wallet
  if ((navigator as any).brave && !hasMetaMask) {
    conflicts.push('Brave Wallet (built-in)')
  }

  if (conflicts.length > 0) {
    return (
      'Multiple wallet extensions detected:\n' +
      conflicts.join(', ') +
      '\nDisable them and leave only MetaMask enabled.'
    )
  }

  return null
}

/* -----------------------------------------------------------
   Main Provider
------------------------------------------------------------ */
export function WalletProvider({ children }: WalletProviderProps) {
  const { address, status } = useAccount()
  const wagmiChainId = useChainId()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { data: wagmiWalletClient } = useWalletClient()

  const [walletWarning, setWalletWarning] = useState<string | null>(null)

  const value = useMemo<WalletContextValue>(
    () => ({
      address: (address as `0x${string}` | undefined) ?? null,
      chainId: wagmiChainId ?? null,
      status: status as WalletStatus,
      walletWarning,
      walletClient: (wagmiWalletClient as WalletClient | null) ?? null,

      connect: async () => {
        const issue = detectWalletConflicts()
        if (issue) {
          toast.error(issue)
          setWalletWarning(issue)
          throw new Error(issue)
        }

        const preferred = connectors[0]
        if (!preferred) {
          throw new Error('No wallet connectors found.')
        }

        await connectAsync({ connector: preferred })
      },

      disconnect: async () => {
        await disconnectAsync()
      },

      signMessage: async (message: string) => {
        const sig = await signMessageAsync({ message })
        return sig as `0x${string}`
      },
    }),
    [
      address,
      wagmiChainId,
      status,
      connectors,
      connectAsync,
      disconnectAsync,
      signMessageAsync,
      walletWarning,
      wagmiWalletClient,
    ]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWallet must be used within <WalletProvider>')
  }
  return ctx
}
