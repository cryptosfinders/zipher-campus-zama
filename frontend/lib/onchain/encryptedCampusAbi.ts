// frontend/lib/onchain/encryptedCampusAbi.ts
import type { Abi } from "viem"
import encryptedCampusAbiJson from "@/abis/EncryptedCampusState.json";

// Adjust the relative path if your layout differs
import EncryptedCampusState from "@/lib/abi/EncryptedCampusState.json";

export const encryptedCampusAbi =
  EncryptedCampusStateArtifact.abi as Abi
