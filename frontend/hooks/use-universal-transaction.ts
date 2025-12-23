// frontend/hooks/use-universal-transaction.ts
'use client'

import { useCallback } from 'react'
import type { Address } from 'viem'
import { getWalletClient } from '@/lib/onchain/wallet'

type NativeTx = {
  to: Address
  data?: `0x${string}`
  valueWei?: bigint
}

type ContractTx = {
  address: Address
  abi: any
  functionName: string
  args?: any[]
  value?: bigint
}

type TxMessages = {
  pendingMessage?: string
  successMessage?: string
  errorMessage?: string
}

type UniversalTxParams = NativeTx | ContractTx

type UniversalTxResult = {
  hash: `0x${string}`
}

/**
 * Single hook you can use for:
 * - Native ETH transfers (to + valueWei)
 * - Contract writes (abi + address + functionName)
 *
 * It uses viem's WalletClient via lib/onchain/wallet.ts (MetaMask).
 */
export function useUniversalTransaction() {
  const sendTransaction = useCallback(
    async (
      params: UniversalTxParams,
      _messages?: TxMessages
    ): Promise<UniversalTxResult> => {
      const walletClient = getWalletClient()
      const [account] = await walletClient.getAddresses()

      try {
        let hash: `0x${string}`

        if ('to' in params && !('abi' in params)) {
          // Native ETH send
          hash = await walletClient.sendTransaction({
            account,
            to: params.to,
            data: params.data,
            value: params.valueWei
          } as any)
        } else {
          // Contract call
          const { address, abi, functionName, args, value } =
            params as ContractTx

          hash = await walletClient.writeContract({
            account,
            address,
            abi,
            functionName,
            args: args ?? [],
            value
          } as any)
        }

        return { hash }
      } catch (err) {
        // Caller is responsible for showing toasts / UI
        throw err
      }
    },
    []
  )

  return { sendTransaction }
}
