import { createPublicClient, http } from "viem";

export const ZAMAFHEVM = {
  id: Number(process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID),
  name: "Zama FH-EVM",
  network: "fhevm",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ZIPHER_FHEVM_RPC!],
    },
  },
  blockExplorers: {
    default: {
      url: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "",
      name: "Explorer",
    },
  },
};

