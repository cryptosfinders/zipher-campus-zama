// frontend/lib/onchain/encryptedCampusAbi.ts
import type { Abi } from "viem"
import encryptedCampusAbiJson from "@/abis/EncryptedCampusState.json"

export const encryptedCampusAbi =
  encryptedCampusAbiJson.abi as Abi

