import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("FHECampusReputation");
  const contract = await Factory.deploy();
  await contract.waitForDeployment(); // Hardhat v2 style
  console.log("FHECampusReputation deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
