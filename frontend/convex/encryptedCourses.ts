import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUserByWallet } from "./utils";

/* -------------------------------------------------------------------------- */
/* CREATE ENCRYPTED LISTING (CREATOR)                                          */
/* -------------------------------------------------------------------------- */

export const submit = mutation({
  args: {
    ciphertext: v.string(),
    address: v.string(),
    groupId: v.id("groups"),
  },
  handler: async (ctx, { ciphertext, address, groupId }) => {
    const user = await requireUserByWallet(ctx, address);

    return ctx.db.insert("encryptedCourses", {
      ciphertext,
      submittedBy: user.walletAddress,
      createdAt: Date.now(),
      groupId,
    });
  },
});

/* -------------------------------------------------------------------------- */
/* MY MEMBERSHIPS — ACTIVE / EXPIRED                                           */
/* -------------------------------------------------------------------------- */

export const listMineWithStatus = query({
  args: { address: v.string() },
  handler: async (ctx, { address }) => {
    const user = await requireUserByWallet(ctx, address);

    const memberships = await ctx.db
      .query("userGroups")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .collect();

    const now = Date.now();

    const results: {
      groupId: any;
      name: string;
      shortDescription?: string;
      thumbnailUrl?: string;
      price: number;
      status: "active" | "expired";
    }[] = [];

    for (const m of memberships) {
      const group = await ctx.db.get(m.groupId);
      if (!group) continue;

      const status: "active" | "expired" =
        m.passExpiresAt && m.passExpiresAt < now
          ? "expired"
          : "active";

      /* ---------------- RESOLVE THUMBNAIL SAFELY ---------------- */
      let thumbnailUrl: string | undefined;

      if (typeof group.thumbnailUrl === "string") {
        const rawId = group.thumbnailUrl.startsWith("storage:")
          ? group.thumbnailUrl.slice("storage:".length)
          : group.thumbnailUrl;

        try {
          thumbnailUrl = await ctx.storage.getUrl(rawId as any);
        } catch {
          thumbnailUrl = undefined;
        }
      }

      results.push({
        groupId: group._id,
        name: group.name,
        shortDescription: group.shortDescription,
        thumbnailUrl,
        price: group.price,
        status,
      });
    }

    return results;
  },
});

/* -------------------------------------------------------------------------- */
/* PUBLIC MARKETPLACE                                                         */
/* -------------------------------------------------------------------------- */

export const listMarketplace = query({
  args: {},
  handler: async (ctx) => {
    const encrypted = await ctx.db
      .query("encryptedCourses")
      .order("desc")
      .collect();

    const results: {
      id: any;
      groupId: any;
      title: string;
      description?: string;
      thumbnail?: string;
      price: number;
      billingCadence?: string;
      tags: string[];
    }[] = [];

    for (const entry of encrypted) {
      if (!entry.groupId) continue;

      const group = await ctx.db.get(entry.groupId);
      if (!group) continue;

      if (!group.isListed) continue;
      if (group.price <= 0) continue;

      /* ---------------- RESOLVE THUMBNAIL SAFELY ---------------- */
      let thumbnail: string | undefined;

      if (typeof group.thumbnailUrl === "string") {
        const rawId = group.thumbnailUrl.startsWith("storage:")
          ? group.thumbnailUrl.slice("storage:".length)
          : group.thumbnailUrl;

        try {
          thumbnail = await ctx.storage.getUrl(rawId as any);
        } catch {
          thumbnail = undefined;
        }
      }

      results.push({
        id: entry._id,
        groupId: group._id,
        title: group.name,
        description: group.shortDescription,
        thumbnail,
        price: group.price,
        billingCadence: group.billingCadence,
        tags: group.tags ?? [],
      });
    }

    return results;
  },
});
