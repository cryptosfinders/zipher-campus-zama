const NULL_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`

export const ADDRESSES = {
  MEMBERSHIP:
    (process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,

  MARKETPLACE:
    (process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,

  REGISTRAR:
    (process.env.NEXT_PUBLIC_REGISTRAR_CONTRACT_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,

  REVENUE:
    (process.env.NEXT_PUBLIC_REVENUE_SPLIT_ROUTER_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,

  FHE_REPUTATION:
    (process.env.NEXT_PUBLIC_FHE_REPUTATION_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,

  // 🆕 EncryptedCampusState (full FHE state)
  ENCRYPTED_CAMPUS_STATE:
    (process.env
      .NEXT_PUBLIC_ENCRYPTED_CAMPUS_STATE_ADDRESS as `0x${string}`) ||
    NULL_ADDRESS,
} as const

console.log("ADDRESSES =>", ADDRESSES)
