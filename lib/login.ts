import { api } from "@/convex/_generated/api";

export async function loginWithWallet(convex, address: string) {
  const token = await convex.mutation(api.auth.login, { address });
  convex.setAuth(token);
}
