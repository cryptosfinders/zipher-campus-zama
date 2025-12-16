'use client'

import type { Address } from 'viem'
import { registrarAbi } from '@/lib/onchain/abi'
import { OnchainService } from './base'

export class RegistrarService extends OnchainService {
  constructor(config: { address: Address; chainId?: number }) {
    super(config)
  }

  /** Register Course using MetaMask */
  async registerCourse(
    walletClient: any,
    owner: Address,
    courseId: bigint,
    priceWei: bigint,
    recipients: Address[],
    sharesBps: number[],
    duration: bigint,
    cooldown: bigint
  ) {
    return this.write({
      abi: registrarAbi,
      functionName: 'registerCourse',
      args: [
        courseId,
        priceWei,
        recipients,
        sharesBps,
        duration,
        cooldown
      ],
      walletClient,
      address: owner
    })
  }
}
