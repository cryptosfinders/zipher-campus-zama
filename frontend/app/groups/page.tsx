'use client'

import { useEffect } from 'react'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { GroupDirectory } from '@/features/groups/components/group-directory'

/* 🔥 New wallet system */
import { useWallet } from '@/lib/web3/WalletProvider'

export default function GroupsPage() {
  const { address } = useWallet()   // ✅ Replaces usePushAccount
  const storeUser = useMutation(api.users.store)

  /* Store user address once connected */
  useEffect(() => {
    if (!address) return
    storeUser({ address }).catch(() => {
      /* Ignore duplicate upsert errors */
    })
  }, [address, storeUser])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">

      {/* GOLD decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_hsl(var(--primary)/0.12),_transparent_65%)] blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,_hsl(var(--accent)/0.1),_transparent_65%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-[radial-gradient(circle,_hsl(var(--primary)/0.08),_transparent_70%)] blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-12 px-6 pb-24 pt-16 sm:pt-20">

        {/* GOLD Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-card/85 px-10 py-12 shadow-2xl shadow-primary/5 backdrop-blur-xl md:px-14">

          {/* Gold glow accents */}
          <div className="pointer-events-none absolute -right-12 top-12 h-64 w-64 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--accent)/0.15)] blur-3xl" />        
          <div className="pointer-events-none absolute -bottom-12 left-16 h-56 w-56 rounded-full bg-gradient-to-br from-[hsl(var(--accent)/0.15)] to-[hsl(var(--primary)/0.12)] blur-3xl" />      

          <div className="relative space-y-4">

            {/* Zipher Campus Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">        
                Encrypted Learning Communities
              </p>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              <span className="text-foreground">Your FHE-Powered</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Private Learning Hub
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Zipher Campus unlocks private-by-default learning communities on{' '}
              <span className="font-semibold text-foreground">Zama FH-EVM</span>.
              Host encrypted groups, manage memberships, share lessons, and collaborate —        
              all protected by{' '}
              <span className="font-semibold text-foreground">Fully Homomorphic Encryption</span>.
            </p>
          </div>
        </div>

        {/* Directory Content */}
        <section className="flex flex-1 flex-col">
          <GroupDirectory />
        </section>

      </main>
    </div>
  )
}
