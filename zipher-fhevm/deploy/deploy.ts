import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const networkName = hre.network.name; // ✅ FIX

  // -------------------------------------------------------
  // SKIP FHECounter on Sepolia (NOT required on-chain)
  // -------------------------------------------------------
  if (networkName === "sepolia") {
    log("⏭  Skipping FHECounter on Sepolia (not needed).");
    return;
  }

  // -------------------------------------------------------
  // LOCAL FH-EVM / HARDHAT DEPLOY
  // -------------------------------------------------------
  const deployedFHECounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });

  console.log("FHECounter contract:", deployedFHECounter.address);
};

export default func;

func.id = "deploy_fheCounter";
func.tags = ["FHECounter"];
