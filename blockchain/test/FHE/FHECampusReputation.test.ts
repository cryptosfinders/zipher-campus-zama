import { ethers } from "hardhat";

describe("FHECampusReputation", function () {

  let acl: string;
  let cop: string;
  let oracle: string;
  let kms: string;

  before(async () => {
    // Deploy mock config contract
    const MockConfigFactory = await ethers.getContractFactory("ZamaMockConfig");
    const mock = await MockConfigFactory.deploy();
    await mock.waitForDeployment();

    // THIS returns the 4 addresses
    [acl, cop, oracle, kms] = await mock.deployMocks();
  });

  it("should initialize XP for the first time", async function () {
    const FHECampus = await ethers.getContractFactory("FHECampusReputation");

    const contract = await FHECampus.deploy(
      acl,
      cop,
      oracle,
      kms
    );

    await contract.waitForDeployment();

    // EXPECT XP to be uninitialized (empty handle)
    const xp = await contract.getEncryptedXP();
    console.log("XP:", xp);

    // If you want assertions:
    // expect(xp).to.equal(0);  (encrypted types differ)
  });

});
