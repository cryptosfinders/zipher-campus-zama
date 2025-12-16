// convex/config.ts

export const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ??
  "https://eth-sepolia.g.alchemy.com/v2/Q5SVqxq6UPyg0qOg6nkHY";

export const ZIPHER_FHEVM_RPC_URL =
  process.env.ZIPHER_FHEVM_RPC_URL ?? "http://127.0.0.1:8545";

export const ZIPHER_CHAIN_ID = Number(
  process.env.ZIPHER_CHAIN_ID ?? "31337"
);

export const REGISTRAR_CONTRACT_ADDRESS =
  process.env.REGISTRAR_CONTRACT_ADDRESS ??
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
