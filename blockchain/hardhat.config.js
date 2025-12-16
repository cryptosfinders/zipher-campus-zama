require("ts-node").register({
  transpileOnly: true,
  compilerOptions: { moduleResolution: "node" },
});

require("@nomicfoundation/hardhat-toolbox");
require("@fhevm/hardhat-plugin");
require("hardhat-deploy");  // ⭐ REQUIRED for "hardhat deploy"
require("dotenv").config();

module.exports = {
  // ⭐ hardhat-deploy REQUIRED SECTION
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.25",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 31337,
      initialBaseFeePerGas: 0,
    },

    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },

    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    push_donut: {
      url: "https://dnt-rpc.pushnodes.com",
      chainId: 1891,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      allowUnlimitedContractSize: true,
    },

    zama_fhevm: {
      url: "https://fhevm.zama.ai",
      chainId: 10901,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      allowUnlimitedContractSize: true,
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
