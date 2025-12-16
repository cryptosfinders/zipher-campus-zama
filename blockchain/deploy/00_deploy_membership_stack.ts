import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying Zipher Campus Membership Stack...");
  log("Deployer:", deployer);

  // 1. Deploy MembershipPass1155
  const membership = await deploy("MembershipPass1155", {
    from: deployer,
    args: [
      "https://api.zipher-campus/metadata/{id}.json", // You can change this later
      deployer,
    ],
    log: true,
  });

  const membershipInstance = await ethers.getContractAt(
    "MembershipPass1155",
    membership.address
  );

  // 2. Deploy MembershipMarketplace
  const marketplace = await deploy("MembershipMarketplace", {
    from: deployer,
    args: [membership.address],
    log: true,
  });

  // 3. Deploy Registrar
  const registrar = await deploy("Registrar", {
    from: deployer,
    args: [membership.address, deployer],
    log: true,
  });

  const registrarInstance = await ethers.getContractAt(
    "Registrar",
    registrar.address
  );

  // 4. Grant roles
  const REGISTRAR_ROLE = ethers.keccak256(
    ethers.toUtf8Bytes("REGISTRAR_ROLE")
  );
  const MARKETPLACE_ROLE = ethers.keccak256(
    ethers.toUtf8Bytes("MARKETPLACE_ROLE")
  );

  await (await membershipInstance.grantRole(REGISTRAR_ROLE, registrar.address)).wait();
  await (await membershipInstance.grantRole(MARKETPLACE_ROLE, marketplace.address)).wait();

  // 5. Wire Registrar -> Marketplace
  await (await registrarInstance.setMarketplace(marketplace.address)).wait();

  log("MembershipPass1155 deployed at:", membership.address);
  log("MembershipMarketplace deployed at:", marketplace.address);
  log("Registrar deployed at:", registrar.address);

  log("Roles assigned and marketplace wired.");
  log("🚀 Zipher Campus Membership Stack deployed successfully!");
};

export default func;
func.tags = ["membership-stack"];
