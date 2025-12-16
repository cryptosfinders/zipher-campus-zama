'use client'

import { ADDRESSES } from '@/lib/onchain/contracts'

export default function Debug() {
  console.log("DEBUG ADDRESSES =>", ADDRESSES)
  return (
    <pre style={{ whiteSpace: 'pre-wrap', padding: 20 }}>
      {JSON.stringify(ADDRESSES, null, 2)}
    </pre>
  )
}
