import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying FHECampusReputation (LOCAL MOCKS)...");

  // Deploy mock config
  const MockConfigFactory = await ethers.getContractFactory("ZamaMockConfig");
  const mockConfig = await MockConfigFactory.deploy();
  await mockConfig.waitForDeployment();

  console.log("ZamaMockConfig deployed at:", await mockConfig.getAddress());

  // CORRECT TUPLE DESTRUCTURE
  const [acl, coprocessor, oracle, kms] = await mockConfig.deployMocks();

  console.log("Mocks deployed:");
  console.log(" ACL:", acl);
  console.log(" COP:", coprocessor);
  console.log(" ORACLE:", oracle);
  console.log(" KMS:", kms);

  // Deploy main reputation contract
  const RepFactory = await ethers.getContractFactory("FHECampusReputation");
  const rep = await RepFactory.deploy(acl, coprocessor, oracle, kms);
  await rep.waitForDeployment();

  console.log("🎉 LOCAL FHECampusReputation deployed at:", await rep.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
