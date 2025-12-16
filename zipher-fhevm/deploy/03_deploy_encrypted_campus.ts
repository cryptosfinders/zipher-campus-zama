import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("🚀 Deploying EncryptedCampusState to network:", network.name);

  const encrypted = await deploy("EncryptedCampusState", {
    from: deployer,
    args: [],
    log: true,
  });

  log("✅ EncryptedCampusState deployed at:", encrypted.address);
};

export default func;
func.tags = ["EncryptedCampus"];
