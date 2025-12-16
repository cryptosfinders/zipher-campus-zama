// frontend/features/groups/hooks/use-renew-subscription.ts
import { useCallback, useMemo, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { PLATFORM_TREASURY_ADDRESS } from '@/lib/config'

import { useEthereumAccount } from '@/hooks/use-ethereum-account'
import { useUniversalTransaction } from '@/hooks/use-universal-transaction'

import {
  resolvePlatformFeeQuote,
  validatePlatformFeeBalance
} from '@/lib/pricing/platform-fee'

import { getSepoliaPublicClient } from '@/lib/onchain/publicClients'
import { useGroupContext } from '../context/group-context'

type RenewResult = {
  endsOn: number | null
  txHash: `0x${string}`
}

export function useRenewSubscription() {
  const { group } = useGroupContext()
  const { address } = useEthereumAccount()
  const { sendTransaction } = useUniversalTransaction()

  const publicClient = useMemo(() => getSepoliaPublicClient(), [])

  const { mutate, pending: isMutating } = useApiMutation(
    api.groups.renewSubscription
  )

  const [isTransacting, setIsTransacting] = useState(false)

  const treasuryAddress = PLATFORM_TREASURY_ADDRESS as `0x${string}`

  const renew = useCallback(async (): Promise<RenewResult> => {
    if (!group?._id) throw new Error('Group context missing')
    if (!address) throw new Error('Connect wallet first')

    setIsTransacting(true)

    try {
      // ✔ New fee quote source (correct)
      const feeQuote = await resolvePlatformFeeQuote({
        treasuryAddress
      })

      // ✔ Refactored validation (correct)
      const check = await validatePlatformFeeBalance({
        quote: feeQuote,
        userAddress: address,
        publicClient
      })

      if (!check.ok) throw new Error(check.reason)

      const txHash = await sendTransaction({
        to: treasuryAddress,
        value: feeQuote.amountWei
      })

      const result = await mutate({
        groupId: group._id,
        ownerAddress: address,
        paymentTxHash: txHash
      })

      return {
        endsOn: result?.endsOn ?? null,
        txHash
      }
    } finally {
      setIsTransacting(false)
    }
  }, [address, group?._id, publicClient, mutate, sendTransaction, treasuryAddress])

  return {
    renew,
    isRenewing: isTransacting || isMutating
  }
}
