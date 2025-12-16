import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log("🚀 Deploying Marketplace, MembershipPass1155, and Registrar...");

  /* ------------------------------------------------------ */
  /* 1) Deploy Marketplace                                  */
  /* ------------------------------------------------------ */
  const marketplace = await deploy("Marketplace", {
    from: deployer,
    args: [],
    log: true,
  });

  /* ------------------------------------------------------ */
  /* 2) Deploy MembershipPass1155                           */
  /* ------------------------------------------------------ */
  const membership = await deploy("MembershipPass1155", {
    from: deployer,
    args: ["https://example.com/metadata/{id}.json"], // any URI is fine
    log: true,
  });

  /* ------------------------------------------------------ */
  /* 3) Deploy Registrar (requires both addresses)          */
  /* ------------------------------------------------------ */
  const registrar = await deploy("Registrar", {
    from: deployer,
    args: [marketplace.address, membership.address],
    log: true,
  });

  log(`✅ Marketplace deployed at:         ${marketplace.address}`);
  log(`✅ MembershipPass1155 deployed at:  ${membership.address}`);
  log(`✅ Registrar deployed at:           ${registrar.address}`);
};

export default func;
func.tags = ["RegistrarSuite"];
