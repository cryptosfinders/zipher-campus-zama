'use client'

import { ReactNode } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

import { fhevmChain, sepoliaChain } from '@/lib/onchain/network'

/**
 * CHAINS
 */
const CHAINS = [sepoliaChain, fhevmChain] as const

/**
 * WAGMI CONFIG — SSR MUST BE DISABLED
 *
 * SSR MUST be false for:
 *  - WalletConnect
 *  - MetaMask injected provider
 *  - Anything using indexedDB / window
 */
const wagmiConfig = createConfig({
  chains: CHAINS,
  transports: {
    [sepoliaChain.id]: http(sepoliaChain.rpcUrls.default.http[0]!),
    [fhevmChain.id]: http(fhevmChain.rpcUrls.default.http[0]!)
  },
  connectors: [
    injected({
      shimDisconnect: true
    }),

    walletConnect({
      projectId: 'zipher-campus-zama',
      metadata: {
        name: 'Zipher Campus',
        description: 'Encrypted learning spaces',
        url: 'https://zipher-campus.local',
        icons: ['https://avatars.githubusercontent.com/u/121221249']
      },
      showQrModal: true
    })
  ],

  /**
   * THE IMPORTANT FIX ⬇️⬇️⬇️
   */
  ssr: false
})

/**
 * CLIENT-ONLY WRAPPER
 */
export function WagmiClientWrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {children}
    </WagmiProvider>
  )
}

export default WagmiClientWrapper
