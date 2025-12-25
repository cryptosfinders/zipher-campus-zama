import { createPublicClient, http, defineChain } from "viem";
import { sepolia } from "viem/chains";

/* -------------------------------
   RPC ENV CONFIG (VERY IMPORTANT)
-------------------------------- */
const SEPOLIA_RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  process.env.SEPOLIA_RPC_URL ||
  "";

//const FHEVM_RPC =
  //process.env.NEXT_PUBLIC_ZIPHER_FHEVM_RPC ||
  //"http://127.0.0.1:8545";

//const FHEVM_CHAIN_ID = Number(
  //process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID || "31337"
//);

/* -------------------------------
   FHEVM Chain (Zipher FH-EVM)
-------------------------------- */
//export const fhevmChain = defineChain({
 // id: FHEVM_CHAIN_ID,
 // name: "Zipher FH-EVM",
 // network: "zipher-fhevm",
 // nativeCurrency: {
   // name: "ETH",
   // symbol: "ETH",
   // decimals: 18,
 // },
 // rpcUrls: {
   // default: { http: [FHEVM_RPC] },
   // public: { http: [FHEVM_RPC] },
  //},
//});

/* -------------------------------
   Sepolia Public Client
-------------------------------- */
export function getSepoliaPublicClient() {
  if (!SEPOLIA_RPC) {
    throw new Error(
      "Missing NEXT_PUBLIC_SEPOLIA_RPC_URL – cannot create Sepolia client"
    );
  }

  return createPublicClient({
    chain: sepolia,
    transport: http(SEPOLIA_RPC),
  });
}

/* -------------------------------
   FHEVM Public Client
-------------------------------- */
//export function getFhevmPublicClient() {
 // return createPublicClient({
   // chain: fhevmChain,
   // transport: http(FHEVM_RPC),
 // });
//}
