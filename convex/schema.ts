// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // 🔹 Users
  users: defineTable({
  walletAddress: v.string(),
  displayName: v.optional(v.union(v.string(), v.null())),
  avatarUrl: v.optional(v.union(v.string(), v.null())),
  about: v.optional(v.union(v.string(), v.null()))
}).index('by_wallet', ['walletAddress']),

  // 🔹 Groups (communities / campuses)
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    aboutUrl: v.optional(v.string()),           // can be external or "storage:<id>"
    thumbnailUrl: v.optional(v.string()),       // can be external or "storage:<id>"
    galleryUrls: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    isListed: v.optional(v.boolean()),
    visibility: v.optional(
      v.union(v.literal('public'), v.literal('private'))
    ),
    billingCadence: v.optional(
      v.union(v.literal('free'), v.literal('monthly'))
    ),

    ownerId: v.id('users'),
    price: v.number(),      // monthly price (0 = free)
    memberNumber: v.number(),

    endsOn: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    lastSubscriptionPaidAt: v.optional(v.number()),
    lastSubscriptionTxHash: v.optional(v.string()),

    // 🔐 Optional token-gated access metadata (for your FHEVM / on-chain checks)
    tokenGateContract: v.optional(v.string()), // ERC20 / ERC721 / custom
    tokenGateChainId: v.optional(v.number()),
    tokenGateType: v.optional(
      v.union(
        v.literal('erc20'),
        v.literal('erc721'),
        v.literal('custom')
      )
    )
  })
    .index('by_name', ['name'])
    .index('by_ownerId', ['ownerId'])
    .index('by_subscriptionId', ['subscriptionId']),

  // 🔹 Group revenue share admins
  groupAdministrators: defineTable({
    groupId: v.id('groups'),
    adminId: v.id('users'),
    shareBps: v.number() // 100 = 1%, 10000 = 100%
  })
    .index('by_groupId', ['groupId'])
    .index('by_adminId', ['adminId']),

  // 🔹 Memberships
  userGroups: defineTable({
    userId: v.id('users'),
    groupId: v.id('groups'),
    status: v.optional(v.union(v.literal('active'), v.literal('left'))),
    joinedAt: v.optional(v.number()),
    leftAt: v.optional(v.number()),
    passExpiresAt: v.optional(v.number())
  })
    .index('by_userId', ['userId'])
    .index('by_groupId', ['groupId']),

  encryptedCourses: defineTable({
    ciphertext: v.string(),
    submittedBy: v.string(),
    createdAt: v.number(),
    groupId: v.optional(v.id("groups")),    // optional link to a community
    courseId: v.optional(v.id("courses")),  // optional link to a course
  })
    .index("by_user", ["submittedBy"])
    .index("by_group", ["groupId"]),


  // 🔹 Posts / feed
  posts: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    authorId: v.id('users'),
    groupId: v.id('groups'),
    lessonId: v.optional(v.id('lessons'))
  })
    .index('by_title', ['title'])
    .index('by_groupId', ['groupId'])
    .index('by_lessonId', ['lessonId']),

  comments: defineTable({
    postId: v.id('posts'),
    content: v.string(),
    authorId: v.id('users')
  }).index('by_postId', ['postId']),

  likes: defineTable({
    postId: v.id('posts'),
    userId: v.id('users')
  })
    .index('by_postId', ['postId'])
    .index('by_postId_userId', ['postId', 'userId']),

  // 🔹 Courses / Modules / Lessons
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    groupId: v.id('groups'),
    thumbnailUrl: v.optional(v.string()) // can be storage:<id> or full URL
  }).index('by_groupId', ['groupId']),

  modules: defineTable({
    title: v.string(),
    courseId: v.id('courses')
  }).index('by_courseId', ['courseId']),

encryptedMetrics: defineTable({
  key: v.string(),           // e.g. "group:<id>:views"
  value: v.number(),         // encrypted later
  updatedAt: v.number(),
}).index("by_key", ["key"]),

  lessons: defineTable({
    title: v.string(),
    description: v.string(),
    moduleId: v.id('modules'),
    youtubeUrl: v.string(),

    // 🔐 FHEVM / encrypted lesson support (all optional, so safe)
    encryptedContentStorageId: v.optional(v.id('_storage')),
    encryptedContentUrl: v.optional(v.string()),

    // "public" = anyone, "members" = active membership, "token" = token-gated
    accessLevel: v.optional(
      v.union(
        v.literal('public'),
        v.literal('members'),
        v.literal('token')
      )
    )
  }).index('by_moduleId', ['moduleId']),
// 🔹 Media files metadata (for uploads)
  mediaFiles: defineTable({
    storageId: v.id('_storage'),
    url: v.string(),
    createdAt: v.number()
  }).index('by_createdAt', ['createdAt'])
})
