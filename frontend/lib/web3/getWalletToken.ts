// frontend/lib/web3/getWalletToken.ts
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export async function getWalletToken(
  address: `0x${string}`
): Promise<string | null> {
  try {
    const token = await convex.mutation(api.auth.login, { address });
    return token ?? null;
  } catch (err) {
    console.error("Token request failed:", err);
    toast.error("Unable to authenticate with Convex.");
    return null;
  }
}
