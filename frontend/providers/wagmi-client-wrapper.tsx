'use client'

import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

import { fhevmChain, sepoliaChain } from '@/lib/onchain/network'

const CHAINS = [sepoliaChain, fhevmChain] as const

export function WagmiClientWrapper({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ReturnType<typeof createConfig> | null>(
    null
  )

  useEffect(() => {
    // 🚨 GUARANTEED BROWSER-ONLY
    const cfg = createConfig({
      chains: CHAINS,
      transports: {
        [sepoliaChain.id]: http(sepoliaChain.rpcUrls.default.http[0]!),
        [fhevmChain.id]: http(fhevmChain.rpcUrls.default.http[0]!)
      },
      connectors: [
        injected({ shimDisconnect: true }),

        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          metadata: {
            name: 'Zipher Campus',
            description: 'Encrypted learning spaces',
            url: 'https://zipher-campus.app',
            icons: ['https://avatars.githubusercontent.com/u/121221249']
          },
          showQrModal: true
        })
      ],
      ssr: false
    })

    setConfig(cfg)
  }, [])

  // ⛔ Prevent rendering until wagmi is ready
  if (!config) return null

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

export default WagmiClientWrapper
