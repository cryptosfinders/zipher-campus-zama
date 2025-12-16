// frontend/lib/onchain/abi/registrarAbi.ts

export const registrarAbi = [
  {
    type: "function",
    name: "marketplace",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "registerCourse",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "payees", type: "address[]" },
      { name: "sharesBps", type: "uint16[]" },
      { name: "duration", type: "uint256" },
      { name: "transferCooldown", type: "uint256" },
    ],
    outputs: [],
  },
] as const;
