'use client'

import type { Address } from 'viem'
import { membershipPass1155Abi } from '@/lib/onchain/abi'
import { OnchainService } from './base'

export class MembershipPassService extends OnchainService {
  /** READS */
  async getCourse(courseId: bigint) {
    return this.read({
      abi: membershipPass1155Abi,
      functionName: 'getCourse',
      args: [courseId]
    })
  }

  async balanceOf(user: Address, courseId: bigint) {
    return this.read({
      abi: membershipPass1155Abi,
      functionName: 'balanceOf',
      args: [user, courseId]
    })
  }

  /** WRITES */
  async setPrice(walletClient: any, account: Address, id: bigint, price: bigint) {
    return this.write({
      abi: membershipPass1155Abi,
      functionName: 'setPrice',
      args: [id, price],
      walletClient,
      address: account
    })
  }

  async setApproval(walletClient: any, owner: Address, operator: Address, approved: boolean) {
    return this.write({
      abi: membershipPass1155Abi,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
      walletClient,
      address: owner
    })
  }
}
