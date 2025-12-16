// frontend/lib/chains.ts
export type SupportedChainId = number;

const ZIPHER_CHAIN_ID = Number(process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID || 31337);

export const CHAINS = {
  local: {
    id: ZIPHER_CHAIN_ID,
    name: 'Hardhat Local',
    rpcUrl: process.env.NEXT_PUBLIC_ZIPHER_FHEVM_RPC || 'http://127.0.0.1:8545',
    explorerUrl: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || '',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  // You can add Sepolia / Zama testnet here later if needed:
  // sepolia: { id: 11155111, ... }
} as const;

export const DEFAULT_CHAIN = CHAINS.local;
export const SUPPORTED_CHAINS = [CHAINS.local]; // push more chain configs here later

export function getChainById(chainId: number) {
  return SUPPORTED_CHAINS.find((c) => c.id === chainId) || null;
}

export function toHexChainId(id: number) {
  return '0x' + id.toString(16);
}
