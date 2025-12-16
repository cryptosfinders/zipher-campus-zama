// convex/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: { address: v.string() },
  handler: async (ctx, { address }) => {
    const walletAddress = address.toLowerCase();

    let user = await ctx.db
      .query("users")
      .withIndex("by_wallet", q => q.eq("walletAddress", walletAddress))
      .unique();

    if (!user) {
      await ctx.db.insert("users", {
        walletAddress,
        displayName: null,
        avatarUrl: null,
        about: null,
      });
    }

    // ✅ Lightweight token — no heavy logic
    return walletAddress;
  },
});

