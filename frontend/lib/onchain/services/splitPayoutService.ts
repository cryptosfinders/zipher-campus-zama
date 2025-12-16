'use client'

import type { Address } from 'viem'
import { splitPayoutAbi } from '@/lib/onchain/abi'
import { OnchainService } from './base'

export class SplitPayoutService extends OnchainService {
  async pending(recipient: Address) {
    return this.read({
      abi: splitPayoutAbi,
      functionName: 'pending',
      args: [recipient]
    })
  }

  async release(walletClient: any, caller: Address, recipient: Address) {
    return this.write({
      abi: splitPayoutAbi,
      functionName: 'release',
      args: [recipient],
      walletClient,
      address: caller
    })
  }
}
