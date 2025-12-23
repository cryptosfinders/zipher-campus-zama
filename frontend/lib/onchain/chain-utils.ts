// frontend/lib/onchain/chain-utils.ts
import { createPublicClient, http } from 'viem';
import { getSepoliaPublicClient, getFhevmPublicClient } from './publicClients';

export function getPublicClientForRpc(rpcUrl: string) {
  return createPublicClient({
    transport: http(rpcUrl)
  });
}

// For checking valid RPC
export function rpcCompatibleWithClient(rpcUrl?: string) {
  return typeof rpcUrl === 'string' && rpcUrl.length > 0;
}
