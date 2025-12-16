import { createPublicClient, http } from 'viem'
import { sepolia } from 'wagmi/chains'

export const getPublicClient = () =>
  createPublicClient({
    chain: sepolia, // swap to zama FH-EVM RPC when needed
    transport: http()
  })
