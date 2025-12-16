const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const provider = hre.network.provider;

  const VERIFIER_ADDR    = "0x901F8942346f7AB3a01F6D7613119Bca447Bb030";
  const COPROCESSOR_ADDR = "0xe3a9105a3a932253A70F126eb1E3b589C643dD24";
  const ACL_ADDR         = "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D";

  const Verifier = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/FHE/mocks/VerifierMock.sol/VerifierMock.json")
  ));
  const Gateway = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/FHE/mocks/GatewayMock.sol/GatewayMock.json")
  ));

  // inject code at verifier address
  console.log("Injecting VerifierMock at", VERIFIER_ADDR);
  await provider.send("hardhat_setCode", [VERIFIER_ADDR, Verifier.deployedBytecode]);

  // inject code at coprocessor address (use Gateway Mock)
  console.log("Injecting GatewayMock at", COPROCESSOR_ADDR);
  await provider.send("hardhat_setCode", [COPROCESSOR_ADDR, Gateway.deployedBytecode]);

  // inject code at ACL address (Gateway mock works fine)
  console.log("Injecting GatewayMock at", ACL_ADDR);
  await provider.send("hardhat_setCode", [ACL_ADDR, Gateway.deployedBytecode]);

  console.log("FHEVM local mocks injected successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
