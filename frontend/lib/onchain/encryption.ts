import { createInstance } from "@fhevm/sdk";

export async function makeEncryptedUint64(
  contractAddress: string,
  userAddress: string,
  value: bigint
) {
  const fhevm = await createInstance({
    chainId: Number(process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID),
    gatewayChainId: Number(process.env.NEXT_PUBLIC_FHEVM_GATEWAY_CHAIN_ID),

    verifyingContractAddress:
      process.env.NEXT_PUBLIC_FHEVM_VERIFYING_CONTRACT as `0x${string}`,

    kmsContractAddress:
      process.env.NEXT_PUBLIC_FHEVM_KMS_CONTRACT as `0x${string}`,

    aclContractAddress:
      process.env.NEXT_PUBLIC_FHEVM_ACL_CONTRACT as `0x${string}`,
  });

  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  input.add64(value);
  return input.encrypt();
}
