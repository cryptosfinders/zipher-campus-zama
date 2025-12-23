// frontend/lib/encrypted-campus-client.ts

import {
  type WalletClient,
  type PublicClient,
  keccak256,
  toBytes,
  type Hex,
} from "viem"

import {
  publicClient as getPublicClient,
  walletClient as getWalletClient,
  ACTIVE_CHAIN_ID,
} from "@/lib/onchain/network"

import { ADDRESSES } from "@/lib/onchain/contracts"
import { encryptedCampusAbi } from "@/lib/onchain/encryptedCampusAbi"

// Helpers
export type Address = `0x${string}`

function ensureAddress(addr: string | undefined): Address {
  if (!addr) throw new Error("Missing address")
  return addr as Address
}

function idFromLabel(label: string): Hex {
  return keccak256(toBytes(label))
}

const CAMPUS_ADDRESS = ensureAddress(
  ADDRESSES.ENCRYPTED_CAMPUS_STATE !==
    ("0x0000000000000000000000000000000000000000" as Address)
    ? ADDRESSES.ENCRYPTED_CAMPUS_STATE
    : undefined
)

export class EncryptedCampusClient {
  private pc: PublicClient
  private wc: WalletClient | null

  constructor() {
    this.pc = getPublicClient()
    this.wc = getWalletClient()
  }

  private assertWallet() {
    if (!this.wc) {
      throw new Error("No wallet client: connect wallet first")
    }
  }

  /* ---------------------------------------------------------------------- */
  /* ID HELPERS                                                             */
  /* ---------------------------------------------------------------------- */

  groupId(label: string): Hex {
    return idFromLabel(label)
  }

  metricId(label: string): Hex {
    return idFromLabel(label)
  }

  pollId(label: string): Hex {
    return idFromLabel(label)
  }

  /* ---------------------------------------------------------------------- */
  /* 1️⃣ MEMBERSHIP (groupId → user → ebool handle)                           */
  /* ---------------------------------------------------------------------- */

  /**
   * Admin path – plaintext membership flag
   */
  async setMembershipPlain(opts: {
    groupLabel: string
    user: Address
    isActive: boolean
  }) {
    this.assertWallet()
    const { groupLabel, user, isActive } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "setMembership",
      args: [this.groupId(groupLabel), user, isActive],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  /**
   * Read encrypted membership handle for (group, user)
   * off-chain code / relayer will decrypt later.
   */
  async getMembershipHandle(opts: {
    groupLabel: string
    user: Address
  }): Promise<Hex> {
    const { groupLabel, user } = opts

    const handle = (await this.pc.readContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "getMembershipHandle",
      args: [this.groupId(groupLabel), user],
    } as any)) as Hex

    return handle
  }

  /* ---------------------------------------------------------------------- */
  /* 2️⃣ REPUTATION (groupId → user → euint64 handle)                        */
  /* ---------------------------------------------------------------------- */

  async initReputationPlain(opts: {
    groupLabel: string
    user: Address
    initialValue: bigint
  }) {
    this.assertWallet()
    const { groupLabel, user, initialValue } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "initReputation",
      args: [this.groupId(groupLabel), user, initialValue],
      account: this.wc!.account!,
    }as any)

    return hash
  }

  async addReputationPlain(opts: {
    groupLabel: string
    user: Address
    delta: bigint
  }) {
    this.assertWallet()
    const { groupLabel, user, delta } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "addReputation",
      args: [this.groupId(groupLabel), user, delta],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  async getReputationHandle(opts: {
    groupLabel: string
    user: Address
  }): Promise<Hex> {
    const { groupLabel, user } = opts

    const handle = (await this.pc.readContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "getReputationHandle",
      args: [this.groupId(groupLabel), user],
    } as any)) as Hex

    return handle
  }

  /* ---------------------------------------------------------------------- */
  /* 3️⃣ POLLS & VOTING (pollId → option → euint64 tallies)                  */
  /* ---------------------------------------------------------------------- */

  async createPoll(opts: { pollLabel: string; maxOption: number }) {
    this.assertWallet()
    const { pollLabel, maxOption } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "createPoll",
      args: [this.pollId(pollLabel), maxOption],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  async sealPoll(opts: { pollLabel: string }) {
    this.assertWallet()
    const { pollLabel } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "sealPoll",
      args: [this.pollId(pollLabel)],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  /**
   * NOTE: This is the *encrypted* vote path.
   * `encOption` and `inputProof` must come from the FHEVM JS SDK / relayer.
   */
  async castVoteEncryptedRaw(opts: {
    pollLabel: string
    encOptionHandle: Hex
    inputProof: Hex | string
  }) {
    this.assertWallet()
    const { pollLabel, encOptionHandle, inputProof } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "castVoteEncrypted",
      args: [this.pollId(pollLabel), encOptionHandle, inputProof],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  async getTallyHandle(opts: {
    pollLabel: string
    option: number
  }): Promise<Hex> {
    const { pollLabel, option } = opts

    const handle = (await this.pc.readContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "getTallyHandle",
      args: [this.pollId(pollLabel), option],
    } as any)) as Hex

    return handle
  }

  /* ---------------------------------------------------------------------- */
  /* 4️⃣ ANALYTICS (metricId → euint64 handle)                               */
  /* ---------------------------------------------------------------------- */

  async incrementMetricPlain(opts: {
    metricLabel: string
    delta: bigint
  }) {
    this.assertWallet()
    const { metricLabel, delta } = opts

    const hash = await this.wc!.writeContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "incrementMetric",
      args: [this.metricId(metricLabel), delta],
      account: this.wc!.account!,
    } as any)

    return hash
  }

  async getMetricHandle(opts: { metricLabel: string }): Promise<Hex> {
    const { metricLabel } = opts

    const handle = (await this.pc.readContract({
      address: CAMPUS_ADDRESS,
      abi: encryptedCampusAbi,
      functionName: "getMetricHandle",
      args: [this.metricId(metricLabel)],
    } as any)) as Hex

    return handle
  }
}
