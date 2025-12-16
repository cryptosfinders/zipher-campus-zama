// frontend/lib/onchain/encryptedCampusAbi.ts
import type { Abi } from "viem"
import encryptedCampusAbiJson from "@/abis/EncryptedCampusState.json";

// Adjust the relative path if your layout differs
import EncryptedCampusStateArtifact from "../../../zipher-fhevm/artifacts/contracts/EncryptedCampusState.sol/EncryptedCampusState.json"

export const encryptedCampusAbi =
  EncryptedCampusStateArtifact.abi as Abi
