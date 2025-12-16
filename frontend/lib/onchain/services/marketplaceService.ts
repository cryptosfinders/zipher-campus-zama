'use client'

import type { Address } from 'viem'
import { membershipMarketplaceAbi } from '@/lib/onchain/abi'
import { OnchainService } from './base'

export class MarketplaceService extends OnchainService {
  /** READ listing(s) */
  async getListing(courseId: bigint, seller: Address) {
    return this.read({
      abi: membershipMarketplaceAbi,
      functionName: 'getListing',
      args: [courseId, seller]
    })
  }

  /** WRITES */
  async purchasePrimary(walletClient: any, buyer: Address, courseId: bigint, price: bigint) {
    return this.write({
      abi: membershipMarketplaceAbi,
      functionName: 'purchasePrimary',
      args: [courseId, price],
      value: price,
      walletClient,
      address: buyer
    })
  }

  async buyListing(walletClient: any, buyer: Address, courseId: bigint, seller: Address, price: bigint) {
    return this.write({
      abi: membershipMarketplaceAbi,
      functionName: 'buyListing',
      args: [courseId, seller, price],
      value: price,
      walletClient,
      address: buyer
    })
  }
}
