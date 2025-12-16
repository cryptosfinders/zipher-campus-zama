import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("🚀 Deploying FH-EVM Membership Suite from:", deployer);
  log("   Network:", hre.network.name);

  // Get deployed contracts from 01_deploy_registrar.ts
  const marketplaceDep = await deployments.get("Marketplace");
  const membershipDep = await deployments.get("MembershipPass1155");
  const registrarDep = await deployments.get("Registrar");

  // Load full contract instances
  const marketplace = await ethers.getContractAt(
    "Marketplace",
    marketplaceDep.address
  );

  const membership = await ethers.getContractAt(
    "MembershipPass1155",
    membershipDep.address
  );

  const registrar = await ethers.getContractAt(
    "Registrar",
    registrarDep.address
  );

  log("📌 Found deployments:");
  log("   Marketplace:        " + marketplaceDep.address);
  log("   MembershipPass1155: " + membershipDep.address);
  log("   Registrar:          " + registrarDep.address);

  // Wire the marketplace to the registrar
  log("🔧 Linking Marketplace → Registrar...");
  await registrar.setMarketplace(marketplaceDep.address);

  // Wire the membership pass to the registrar
  log("🔧 Linking MembershipPass1155 → Registrar...");
  await registrar.setMembershipToken(membershipDep.address);

  log("🎉 FH-EVM membership suite initialized!");
};

export default func;
func.tags = ["MembershipSuite"];
