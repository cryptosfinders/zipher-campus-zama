import { createWalletClient, http, parseAbi, parseGwei } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { sepolia } from "viem/chains"

// --------------------------------------------------
// ✅ VERIFIED ADDRESSES (Sepolia)
// --------------------------------------------------
const REGISTRAR = "0xfcBbe248206a4BF7A56598A9Ef2b7A955fF1Ea03"
const MARKETPLACE = "0xBAAAD6aeDdA4765Cf86e93dcFAED3Ab50c4f7b26"
const MEMBERSHIP = "0xfcBbe248206a4BF7A56598A9Ef2b7A955fF1Ea03" // ⚠️ REPLACE if MembershipPass1155 is different

// --------------------------------------------------
// 🔐 DEPLOYER (OWNER OF REGISTRAR)
// --------------------------------------------------
const account = privateKeyToAccount(
  "0x157ca5cf886bf01a13337f93efa2103df76c4affb3eaef0280148113d52e6f49"
)

// --------------------------------------------------
// 🌐 CLIENT
// --------------------------------------------------
const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
})

// --------------------------------------------------
// 📜 ABI
// --------------------------------------------------
const abi = parseAbi([
  "function setMarketplace(address _marketplace)",
  "function setMembershipToken(address _membershipToken)",
])

// --------------------------------------------------
// 🚀 EXECUTION
// --------------------------------------------------
async function main() {
  console.log("⏳ Wiring Registrar...")

  const tx1 = await client.writeContract({
    address: REGISTRAR,
    abi,
    functionName: "setMarketplace",
    args: [MARKETPLACE],
    gas: 300_000n,
    maxFeePerGas: parseGwei("20"),
    maxPriorityFeePerGas: parseGwei("2"),
  })

  console.log("✅ Marketplace set:", tx1)

  const tx2 = await client.writeContract({
    address: REGISTRAR,
    abi,
    functionName: "setMembershipToken",
    args: [MEMBERSHIP],
    gas: 300_000n,
    maxFeePerGas: parseGwei("20"),
    maxPriorityFeePerGas: parseGwei("2"),
  })

  console.log("✅ Membership token set:", tx2)

  console.log("🎉 Registrar wired successfully")
}

main().catch((err) => {
  console.error("❌ Wiring failed")
  console.error(err)
})
