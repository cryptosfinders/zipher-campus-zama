import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);

  log("----------------------------------------------------");
  log("🚀 Deploying EncryptedCampusState to Sepolia...");
  log(`Deployer: ${deployer}`);

  const campus = await deploy("EncryptedCampusState", {
    from: deployer,
    args: [],
    log: true,
  });

  log("----------------------------------------------------");
  log("✅ EncryptedCampusState deployed!");
  log(`📡 Address: ${campus.address}`);
  log("----------------------------------------------------");

  // We must wait for deployment to finish before returning
  return campus.address;
};

export default func;
func.tags = ["EncryptedCampus"];
