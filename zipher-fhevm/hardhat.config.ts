import * as dotenv from "dotenv";
dotenv.config();

import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "solidity-coverage";

// Tasks
import "./tasks/accounts";
import "./tasks/FHECounter";

/* -------------------------------------------------------------------------- */
/*                              SECRETS LOADING                               */
/* -------------------------------------------------------------------------- */

const MNEMONIC: string = vars.get(
  "MNEMONIC",
  "test test test test test test test test test test test junk"
);

const PRIVATE_KEY: string = process.env.PRIVATE_KEY ?? vars.get("PRIVATE_KEY", "");

const SEPOLIA_RPC_URL: string =
  process.env.SEPOLIA_RPC_URL ??
  vars.get("SEPOLIA_RPC_URL", "https://eth-sepolia.g.alchemy.com/v2/demo");

const ETHERSCAN_API_KEY: string = vars.get("ETHERSCAN_API_KEY", "");

/* -------------------------------------------------------------------------- */
/*                                 HARDHAT CONFIG                             */
/* -------------------------------------------------------------------------- */

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  namedAccounts: {
    deployer: 0,
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },

  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
  },

  networks: {
    /* ---------------------------- LOCAL FH-EVM ---------------------------- */
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },

/* ---------------------------- LOCAL FH-EVM DEVNET ---------------------------- */
  fhevm: {
    url: process.env.FHEVM_RPC_URL || "http://127.0.0.1:8545",
    chainId: Number(process.env.FHEVM_CHAIN_ID || 31337),
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  },

 /* ---------------------------- Foundry Anvil ---------------------------- */
    anvil: {
      chainId: 31337,
      url: "http://localhost:8545",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0/",
        count: 10,
      },
    },

    /* ------------------------------- SEPOLIA ------------------------------ */
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },

  /* ----------------------------- COMPILERS ------------------------------- */
  solidity: {
    compilers: [
      {
        version: "0.8.27",
        settings: {
          metadata: { bytecodeHash: "none" },
          optimizer: { enabled: true, runs: 800 },
          evmVersion: "cancun",
        },
      },
    ],

    overrides: {
      "*": {
        version: "0.8.27",
      },
    },
  },

  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
