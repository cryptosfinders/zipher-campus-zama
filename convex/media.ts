import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

export const generateUploadUrl = mutation({
  args: {},
  handler: async ctx => {
    const url = await ctx.storage.generateUploadUrl()
    return { uploadUrl: url }
  }
})

export const getUrl = query({
  args: {
    storageId: v.id('_storage')
  },
  handler: async (ctx, { storageId }) => {
    const url = await ctx.storage.getUrl(storageId)
    return { url }
  }
})

// ✅ NEW: save uploaded media metadata
export const save = mutation({
  args: {
    storageId: v.id('_storage'),
    url: v.string()
  },
  handler: async (ctx, { storageId, url }) => {
    await ctx.db.insert('mediaFiles', {
      storageId,
      url,
      createdAt: Date.now()
    })
  }
})
