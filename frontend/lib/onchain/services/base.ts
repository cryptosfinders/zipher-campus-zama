// frontend/lib/onchain/services/base.ts
'use client'

import type { Address } from 'viem'
import {
  getFhevmPublicClient,
  getSepoliaPublicClient
} from '@/lib/onchain/publicClients'
import { ZIPHER_CHAIN_ID } from '@/lib/config'

export type ServiceConfig = {
  address: Address
  chainId?: number
}

export class OnchainService {
  address: Address
  chainId?: number

  constructor(config: ServiceConfig) {
    this.address = config.address
    this.chainId = config.chainId
  }

  /** Automatically resolve ETH or FHEVM client */
  getPublicClient() {
    if (Number(this.chainId) === Number(ZIPHER_CHAIN_ID)) {
      return getFhevmPublicClient()
    }
    return getSepoliaPublicClient()
  }

  /** Simple READ wrapper */
  async read(opts: {
    abi: any
    functionName: string
    args?: any[]
  }) {
    const client = this.getPublicClient()
    return client.readContract({
      address: this.address,
      abi: opts.abi,
      functionName: opts.functionName,
      args: opts.args || []
    })
  }

  /** Generic WRITE wrapper via MetaMask walletClient */
  async write(opts: {
    abi: any
    functionName: string
    args?: any[]
    value?: bigint
    walletClient: any
    address: Address
  }) {
    return opts.walletClient.writeContract({
      address: this.address,
      abi: opts.abi,
      functionName: opts.functionName,
      args: opts.args || [],
      value: opts.value
    })
  }
}
