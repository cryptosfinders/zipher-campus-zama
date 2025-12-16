import { execSync } from "child_process";
import hre from "hardhat";

async function main() {
  const marketplace = "0xYOUR_MARKETPLACE_ADDRESS";
  const user = "0xUSER_WALLET_ADDRESS";

  // 30 days expiry
  const expiry = Math.floor(Date.now() / 1000) + 86400 * 30;

  const cmd = `relayer encrypt --node http://127.0.0.1:8545 ${marketplace} ${user} ${expiry}:64`;
  const output = execSync(cmd).toString();

  console.log("CLI Output:", output);

  const { ciphertext, inputProof } = JSON.parse(output);

  const mp = await hre.ethers.getContractAt("MembershipMarketplace", marketplace);
  const tx = await mp.grantMembership(1, ciphertext, inputProof, user);

  console.log("Membership granted:", tx.hash);
}

main().catch(console.error);
