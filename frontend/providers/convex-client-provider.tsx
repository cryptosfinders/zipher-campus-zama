'use client'

import { ReactNode, useEffect, useMemo, useRef } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { useWallet } from '@/lib/web3/WalletProvider'

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet()
  const lastAddress = useRef<string | null>(null)

  const convex = useMemo<ConvexReactClient | null>(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL

    if (!url) {
      console.warn('[Convex] NEXT_PUBLIC_CONVEX_URL missing — Convex disabled')
      return null
    }

    return new ConvexReactClient(url)
  }, [])

  useEffect(() => {
    if (!convex) return

    async function sync() {
      if (!address) {
        convex.clearAuth()
        lastAddress.current = null
        return
      }

      if (lastAddress.current === address) return

      try {
        const token = await convex.mutation(api.auth.login, { address })
        convex.setAuth(async () => token)
        lastAddress.current = address
      } catch (e) {
        console.error('Convex auth failed', e)
        convex.clearAuth()
      }
    }

    sync()
  }, [address, convex])

  // 🚨 If Convex is not configured, DO NOT crash the app
  if (!convex) {
    return <>{children}</>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
