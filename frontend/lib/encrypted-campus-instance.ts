// frontend/lib/encrypted-campus-instance.ts

import { EncryptedCampusClient } from "@/lib/encrypted-campus-client";

/**
 * Singleton instance of the EncryptedCampusClient.
 * Import this anywhere in your React components:
 *
 *   import { encryptedCampus } from "@/lib/encrypted-campus-instance";
 */
export const encryptedCampus = new EncryptedCampusClient();
