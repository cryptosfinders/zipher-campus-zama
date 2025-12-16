import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireUserByWallet } from "./utils";

export const myMemberships = query({
  args: { address: v.string() },
  handler: async (ctx, { address }) => {
    const user = await requireUserByWallet(ctx, address);

    const memberships = await ctx.db
      .query("userGroups")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .collect();

    const now = Date.now();

    return Promise.all(
      memberships.map(async (m) => {
        const group = await ctx.db.get(m.groupId);
        if (!group) return null;

        const isActive =
          !m.passExpiresAt || m.passExpiresAt > now;

        return {
          membershipId: m._id,
          groupId: group._id,
          name: group.name,
          thumbnailUrl: group.thumbnailUrl,
          price: group.price,
          expiresAt: m.passExpiresAt ?? null,
          status: isActive ? "active" : "expired"
        };
      })
    ).then(r => r.filter(Boolean));
  },
});
