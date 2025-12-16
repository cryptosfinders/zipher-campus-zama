// frontend/lib/web3/clients.ts
'use client';

import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { DEFAULT_CHAIN } from '../chains';

const rpcUrl = DEFAULT_CHAIN.rpcUrl;

export const publicClient = createPublicClient({
  chain: {
    id: DEFAULT_CHAIN.id,
    name: DEFAULT_CHAIN.name,
    nativeCurrency: DEFAULT_CHAIN.nativeCurrency,
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
  },
  transport: http(rpcUrl),
});

export async function getWalletClient() {
  if (typeof window === 'undefined') throw new Error('No window');
  const eth = (window as any).ethereum;
  if (!eth) throw new Error('MetaMask not found');

  return createWalletClient({
    chain: {
      id: DEFAULT_CHAIN.id,
      name: DEFAULT_CHAIN.name,
      nativeCurrency: DEFAULT_CHAIN.nativeCurrency,
      rpcUrls: {
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] },
      },
    },
    transport: custom(eth),
  });
}
