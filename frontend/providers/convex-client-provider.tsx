"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ConvexProvider } from "convex/react";

import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { useWallet } from "@/lib/web3/WalletProvider";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet();
  const lastAddress = useRef<string | null>(null);

  useEffect(() => {
    async function sync() {
      if (!address) {
        convex.clearAuth();
        lastAddress.current = null;
        return;
      }

      // 🛑 Prevent infinite auth loops
      if (lastAddress.current === address) return;

      try {
        const token = await convex.mutation(api.auth.login, { address });
        convex.setAuth(async () => token);
        lastAddress.current = address;
      } catch (e) {
        console.error("Convex auth failed", e);
        convex.clearAuth();
      }
    }

    sync();
  }, [address]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
