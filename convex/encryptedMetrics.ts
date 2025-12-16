import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const increment = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const existing = await ctx.db
      .query("encryptedMetrics")
      .withIndex("by_key", q => q.eq("key", key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: existing.value + 1,
        updatedAt: Date.now()
      });
    } else {
      await ctx.db.insert("encryptedMetrics", {
        key,
        value: 1,
        updatedAt: Date.now()
      });
    }
  }
});

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const row = await ctx.db
      .query("encryptedMetrics")
      .withIndex("by_key", q => q.eq("key", key))
      .unique();

    return row?.value ?? 0;
  }
});

