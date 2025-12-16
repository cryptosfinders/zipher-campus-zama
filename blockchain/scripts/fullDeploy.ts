import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

function run(cmd: string) {
  console.log(`\n🔧 Running: ${cmd}`);
  return execSync(cmd, { stdio: "pipe" }).toString();
}

function extractAddress(output: string): string {
  const match = output.match(/0x[a-fA-F0-9]{40}/);
  if (!match) throw new Error("❌ Could not find contract address in output.");
  return match[0];
}

async function main() {
  console.log("🚀 Full deployment started...\n");

  const results: Record<string, string> = {};

  //
  // --------------------------------------------------------
  // 1. LOCAL HARDHAT STACK (Membership + Marketplace + etc)
  // --------------------------------------------------------
  //

  // MembershipPass1155
  let out = run("npx hardhat run scripts/deployMembershipPass.ts --network localhost");
  results.MEMBERSHIP = extractAddress(out);

  // Marketplace
  out = run("npx hardhat run scripts/deployMarketplace.ts --network localhost");
  results.MARKETPLACE = extractAddress(out);

  // Registrar
  out = run("npx hardhat run scripts/deployRegistrar.ts --network localhost");
  results.REGISTRAR = extractAddress(out);

  // Revenue Split Router
  out = run("npx hardhat run scripts/deployRevenueSplitRouter.ts --network localhost");
  results.REVENUE = extractAddress(out);

  // FHE LOCAL (Mocks)
  out = run("npx hardhat run scripts/deploy-fhe-campus-reputation.local.ts --network localhost");
  results.FHE_REPUTATION_LOCAL = extractAddress(out);

  console.log("\n📦 Local Deployment results:");
  console.log(results);

  //
  // --------------------------------------------------------
  // 2. OPTIONAL DEPLOYS — using env flags
  // --------------------------------------------------------
  //

  if (process.env.RUN_SEPOLIA === "1") {
    const out = run("npx hardhat run scripts/deploy-fhe-campus-reputation.sepolia.ts --network sepolia");
    results.FHE_REPUTATION_SEPOLIA = extractAddress(out);
    console.log("➕ Deployed FHE Reputation to Sepolia");
  }

  if (process.env.RUN_ZAMA === "1") {
    const out = run("npx hardhat run scripts/deploy-fhe-campus-reputation.zama.ts --network zama");
    results.FHE_REPUTATION_ZAMA = extractAddress(out);
    console.log("➕ Deployed FHE Reputation to Zama");
  }

  if (process.env.RUN_PUSHCHAIN === "1") {
    const out = run("npx hardhat run scripts/deploy-fhe-campus-reputation.pushchain.ts --network pushchain");
    results.FHE_REPUTATION_PUSHCHAIN = extractAddress(out);
    console.log("➕ Deployed FHE Reputation to PushChain");
  }

  //
  // --------------------------------------------------------
  // 3. Update frontend .env.local dynamically
  // --------------------------------------------------------
  //

  const envPath = path.join(__dirname, "../../frontend/.env.local");
  let env = fs.readFileSync(envPath, "utf8");

  const replace = (key: string, value: string) => {
    const regex = new RegExp(`${key}=.*`, "g");
    env = env.replace(regex, `${key}=${value}`);
  };

  replace("NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS", results.MEMBERSHIP);
  replace("NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS", results.MARKETPLACE);
  replace("NEXT_PUBLIC_REGISTRAR_CONTRACT_ADDRESS", results.REGISTRAR);
  replace("NEXT_PUBLIC_REVENUE_SPLIT_ROUTER_ADDRESS", results.REVENUE);
  replace("NEXT_PUBLIC_FHE_REPUTATION_ADDRESS", results.FHE_REPUTATION_LOCAL);

  fs.writeFileSync(envPath, env);

  console.log("\n✅ Successfully updated frontend/.env.local");
  console.log("🎉 Full deploy + auto-sync completed!\n");
}

main().catch((err) => {
  console.error("\n❌ Deployment failed:");
  console.error(err);
  process.exit(1);
});
