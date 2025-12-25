// lib/config.ts

// ------------------------------
// Network
// ------------------------------
export const ZIPHER_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID ||
    process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID ||
    11155111
);

// FH-EVM RPC (fallback)
export const ZIPHER_FHEVM_RPC =
  process.env.NEXT_PUBLIC_ZIPHER_FHEVM_RPC ||
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

// Explorer (fallback)
export const ZIPHER_EXPLORER_URL =
  process.env.NEXT_PUBLIC_ZIPHER_EXPLORER_URL ||
  "https://sepolia.etherscan.io";

// ------------------------------
// Token
// ------------------------------
export const NATIVE_TOKEN_SYMBOL =
  process.env.NEXT_PUBLIC_NATIVE_TOKEN_SYMBOL ||
  process.env.NEXT_PUBLIC_SEPOLIA_NATIVE_SYMBOL ||
  "ETH";

export const NATIVE_TOKEN_DECIMALS = 18;

// ------------------------------
// Platform fees + membership
// ------------------------------
export const SUBSCRIPTION_PRICE_USD = Number(
  process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_USD || 1
);

export const PLATFORM_FEE_BPS = Number(
  process.env.NEXT_PUBLIC_PLATFORM_FEE_BPS || 0
);

export const PLATFORM_MIN_FEE_WEI =
  process.env.NEXT_PUBLIC_PLATFORM_MIN_FEE_WEI || "0";

export const MEMBERSHIP_DURATION_SECONDS = Number(
  process.env.NEXT_PUBLIC_MEMBERSHIP_DURATION_SECONDS || 2592000
);

export const MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS = Number(
  process.env.NEXT_PUBLIC_MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS || 86400
);

// ------------------------------
// Treasury + Router
// ------------------------------
export const PLATFORM_TREASURY_ADDRESS =
  (process.env.NEXT_PUBLIC_PLATFORM_TREASURY_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const REVENUE_SPLIT_ROUTER =
  (process.env.NEXT_PUBLIC_REVENUE_SPLIT_ROUTER_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

// ------------------------------
// Core contracts (PRODUCTION)
// ------------------------------
export const REGISTRAR_ADDRESS =
  process.env.NEXT_PUBLIC_REGISTRAR_CONTRACT_ADDRESS as `0x${string}`

export const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`

export const MEMBERSHIP_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS as `0x${string}`
