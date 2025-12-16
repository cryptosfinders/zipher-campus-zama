import { getFhevm } from "@fhevm/sdk";

export async function makeEncryptedUint64(contractAddress, userAddress, value) {
  const fhevm = await getFhevm();
  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  input.add64(BigInt(value));
  return input.encrypt();
}
