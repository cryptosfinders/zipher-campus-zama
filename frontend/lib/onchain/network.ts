// frontend/lib/onchain/network.ts
// ------------------------------------------------------
// Dynamic Network Engine — FH-EVM <-> Sepolia Switching
// ------------------------------------------------------

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Chain,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { sepolia } from 'viem/chains'

import {
  ZIPHER_CHAIN_ID,
  ZIPHER_FHEVM_RPC,
  ZIPHER_EXPLORER_URL,
  NATIVE_TOKEN_SYMBOL
} from '@/lib/config'

/* -------------------------------------------------------------------------- */
/*                           NETWORK ENVIRONMENT SWITCH                        */
/* -------------------------------------------------------------------------- */

/**
 * NEXT_PUBLIC_NETWORK determines the active chain:
 *
 *  fhevm   → Local FH-EVM / Hardhat chain
 *  sepolia → Ethereum Sepolia testnet
 */
const NETWORK = process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() ?? 'sepolia'

const IS_FHE = NETWORK === 'fhevm'

/* -------------------------------------------------------------------------- */
/*                               RPC ENDPOINTS                                 */
/* -------------------------------------------------------------------------- */

const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
  'https://eth-sepolia.g.alchemy.com/v2/demo'

const FHE_RPC_URL = ZIPHER_FHEVM_RPC ?? 'http://127.0.0.1:8545'

/* -------------------------------------------------------------------------- */
/*                               CHAIN OBJECTS                                 */
/* -------------------------------------------------------------------------- */

const fhevmChain: Chain = {
  id: ZIPHER_CHAIN_ID || 31337,
  name: 'Zipher FH-EVM',
  nativeCurrency: {
    name: NATIVE_TOKEN_SYMBOL || 'FHE',
    symbol: NATIVE_TOKEN_SYMBOL || 'FHE',
    decimals: 18
  },
  rpcUrls: {
    default: { http: [FHE_RPC_URL] },
    public: { http: [FHE_RPC_URL] }
  },
  blockExplorers: {
    default: {
      name: 'FH Explorer',
      url: ZIPHER_EXPLORER_URL || 'http://localhost:8545'
    }
  }
}

const sepoliaChain: Chain = {
  ...sepolia,
  rpcUrls: {
    default: { http: [SEPOLIA_RPC_URL] },
    public: { http: [SEPOLIA_RPC_URL] }
  },
  blockExplorers: {
    default: {
      name: 'Sepolia Etherscan',
      url:
        process.env.NEXT_PUBLIC_SEPOLIA_EXPLORER ||
        'https://sepolia.etherscan.io'
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                         ACTIVE CHAIN RESOLUTION                             */
/* -------------------------------------------------------------------------- */

const ACTIVE_CHAIN: Chain = IS_FHE ? fhevmChain : sepoliaChain

export const ACTIVE_CHAIN_ID = ACTIVE_CHAIN.id
export const ACTIVE_CHAIN_ID_HEX = `0x${ACTIVE_CHAIN.id.toString(16)}`
export const ACTIVE_CHAIN_NAME = ACTIVE_CHAIN.name
export const ACTIVE_NATIVE_SYMBOL = ACTIVE_CHAIN.nativeCurrency.symbol

export const ACTIVE_RPC_URL = IS_FHE ? FHE_RPC_URL : SEPOLIA_RPC_URL

export const ACTIVE_BLOCK_EXPLORER_URL =
  ACTIVE_CHAIN.blockExplorers?.default?.url

/* -------------------------------------------------------------------------- */
/*                         PUBLIC + WALLET CLIENTS                             */
/* -------------------------------------------------------------------------- */

let _publicClient: PublicClient | null = null

export function publicClient(): PublicClient {
  if (!_publicClient) {
    _publicClient = createPublicClient({
      chain: ACTIVE_CHAIN,
      transport: http(ACTIVE_RPC_URL),
      account: undefined as undefined
    })
  }
  return _publicClient
}

let _walletClient: WalletClient | null = null

export function walletClient(): WalletClient | null {
  if (typeof window === 'undefined') return null

  if (!_walletClient) {
    const eth = (window as any).ethereum
    if (!eth) return null

    _walletClient = createWalletClient({
      chain: ACTIVE_CHAIN,
      transport: custom(eth)
    })
  }

  return _walletClient
}

/* -------------------------------------------------------------------------- */
/*                     EXTRA EXPORTS FOR WAGMI V2 CONFIG                       */
/* -------------------------------------------------------------------------- */

export { fhevmChain, sepoliaChain, ACTIVE_CHAIN }
