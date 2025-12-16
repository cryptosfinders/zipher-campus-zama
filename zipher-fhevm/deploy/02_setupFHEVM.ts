import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("⚙️  Configuring FHEVM oracle + relayer...");
  const campus = await ethers.getContract("EncryptedCampusState", deployer);

  // These values are official ZAMA Sepolia endpoints
  const RELAYER_URL = "https://relayer.testnet.zama.org";
  const DECRYPTION_ORACLE = "0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478";

  // If your contract includes config functions, add them here
  // Example structure (uncomment if needed):
  //
  // const tx = await campus.setRelayer(RELAYER_URL);
  // const rx = await campus.setOracle(DECRYPTION_ORACLE);
  //
  // await tx.wait();
  // await rx.wait();

  log("----------------------------------------------------");
  log("🔗  FHEVM Configuration Summary");
  log(`Relayer URL:       ${RELAYER_URL}`);
  log(`Decryption Oracle: ${DECRYPTION_ORACLE}`);
  log("----------------------------------------------------");

  log("⚠️ NOTE:");
  log("This step is a placeholder. If your contract exposes:");
  log(" - setRelayer()");
  log(" - setOracle()");
  log("I will wire them automatically.");
};

export default func;
func.tags = ["EncryptedCampusSetup"];
