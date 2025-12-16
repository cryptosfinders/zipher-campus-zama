// frontend/lib/onchain/abi/index.ts

// Export structured TypeScript ABIs (from abis.ts)
export * from './abis'

// Export raw JSON artifact ABIs (if you ever need full artifacts)
import RegistrarArtifact from './artifacts/Registrar.json'
import MarketplaceArtifact from './artifacts/MembershipMarketplace.json'
import MembershipPass1155Artifact from './artifacts/MembershipPass1155.json'
import Badge1155Artifact from './artifacts/Badge1155.json'
import RevenueSplitRouterArtifact from './artifacts/RevenueSplitRouter.json'
import SplitPayoutArtifact from './artifacts/SplitPayout.json'

// viem-ready ABI arrays:
export const registrarAbi = RegistrarArtifact.abi as const
export const marketplaceAbi = MarketplaceArtifact.abi as const
export const membershipPass1155Abi = MembershipPass1155Artifact.abi as const
export const badge1155Abi = Badge1155Artifact.abi as const
export const revenueSplitRouterAbi =
  RevenueSplitRouterArtifact.abi as const
export const splitPayoutAbi = SplitPayoutArtifact.abi as const

// Optional: export full artifacts if you ever need bytecode/metadata
export { default as registrarArtifact } from './artifacts/Registrar.json'
export { default as marketplaceArtifact } from './artifacts/MembershipMarketplace.json'
export { default as membershipPass1155Artifact } from './artifacts/MembershipPass1155.json'
export { default as badge1155Artifact } from './artifacts/Badge1155.json'
export { default as revenueSplitRouterArtifact } from './artifacts/RevenueSplitRouter.json'
export { default as splitPayoutArtifact } from './artifacts/SplitPayout.json'
