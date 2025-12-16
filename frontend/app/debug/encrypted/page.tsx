// frontend/app/debug/encrypted/page.tsx
"use client"

import { useEffect, useState } from "react"
import { EncryptedCampusClient } from "@/lib/encrypted-campus-client"
import type { Hex } from "viem"
import { useAccount } from "wagmi"

export default function EncryptedDebugPage() {
  const { address } = useAccount()
  const [repHandle, setRepHandle] = useState<Hex | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!address) return
      setLoading(true)
      try {
        const client = new EncryptedCampusClient()
        const handle = await client.getReputationHandle({
          groupLabel: "zipher-developers",
          user: address,
        })
        setRepHandle(handle)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [address])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Encrypted Campus Debug</h1>
      <p>Connected address: {address ?? "not connected"}</p>
      {loading && <p>Loading encrypted reputation…</p>}
      {repHandle && (
        <p className="break-all text-sm">
          Reputation handle: <span className="font-mono">{repHandle}</span>
        </p>
      )}
    </div>
  )
}
