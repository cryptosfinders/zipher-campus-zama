import { registerCourse } from "./relayerClient";

// Mock encryption fallback until we plug real Zama WASM
function mockEncrypt(plaintext) {
  return `enc(${btoa(plaintext)})`;
}

function mockDecrypt(ciphertext) {
  if (ciphertext.startsWith("enc(") && ciphertext.endsWith(")")) {
    return atob(ciphertext.slice(4, -1));
  }
  return "Invalid ciphertext";
}

export async function encrypt(plaintext) {
  // In future:
  // const ZAMA = await import("@zama/fhe-sdk")
  // return ZAMA.encrypt(plaintext)

  return mockEncrypt(plaintext);
}

export async function decrypt(ciphertext) {
  return mockDecrypt(ciphertext);
}

/**
 * 🔥 High-level helper = encrypt + submit to relayer
 */
export async function encryptAndSubmitCourse(plaintext) {
  const ciphertext = await encrypt(plaintext);
  const result = await registerCourse(ciphertext);
  return { ciphertext, result };
}
