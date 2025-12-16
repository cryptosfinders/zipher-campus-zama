'use client'

import type { Address } from 'viem'
import { badge1155Abi } from '@/lib/onchain/abi'
import { OnchainService } from './base'

export class Badge1155Service extends OnchainService {
  async mintCompletion(walletClient: any, minter: Address, to: Address, courseId: bigint) {
    return this.write({
      abi: badge1155Abi,
      functionName: 'mintCompletion',
      args: [to, courseId],
      walletClient,
      address: minter
    })
  }
}
