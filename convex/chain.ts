// convex/chain.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { createPublicClient, http } from "viem";

import {
  SEPOLIA_RPC_URL,
  ZIPHER_FHEVM_RPC_URL,
  REGISTRAR_CONTRACT_ADDRESS,
} from "./config";

import RegistrarABI from "../frontend/lib/abi/Registrar.json";

// ------------------------------------------------------------
// Clients
// ------------------------------------------------------------
export const sepoliaClient = createPublicClient({
  transport: http(SEPOLIA_RPC_URL),
});

export const fhevmClient = createPublicClient({
  transport: http(ZIPHER_FHEVM_RPC_URL),
});

// ------------------------------------------------------------
// ACTION: Register a course on-chain
// ------------------------------------------------------------
export const registerOnChain = action({
  args: {
    courseId: v.number(),
    priceWei: v.string(),
    recipients: v.array(v.string()),
    shares: v.array(v.number()),
    duration: v.number(),
    transferCooldown: v.number(),
    creator: v.string(), // wallet address
  },

  handler: async (_ctx, args) => {
    const client = fhevmClient;

    const txHash = await client.writeContract({
      address: REGISTRAR_CONTRACT_ADDRESS,
      abi: RegistrarABI.abi,
      functionName: "registerCourse",
      args: [
        args.courseId,
        BigInt(args.priceWei),
        args.recipients,
        args.shares,
        args.duration,
        args.transferCooldown,
      ],
      account: args.creator,
    });

    return txHash;
  },
});
