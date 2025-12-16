import { ACTIVE_CHAIN_ID } from "./network";

export function getRegistrarAddress(): `0x${string}` {
  // FH-EVM local
  if (ACTIVE_CHAIN_ID === 31337) {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  }

  // Sepolia
  if (ACTIVE_CHAIN_ID === 11155111) {
    return "0xfcBbe248206a4BF7A56598A9Ef2b7A955fF1Ea03"; // your Sepolia deployment
  }

  // Fallback
  return "0x0000000000000000000000000000000000000000";
}
