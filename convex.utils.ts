// convex/utils.ts
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";

/** -------------------------------------------------------
 *  Address normalization
 * ------------------------------------------------------*/
export function normalizeAddress(addr: string) {
  return addr.toLowerCase();
}

/** -------------------------------------------------------
 *  Fetch user by wallet
 * ------------------------------------------------------*/
export async function getUserByWallet(ctx: QueryCtx | MutationCtx, address: string) {
  const normalized = normalizeAddress(address);

  return await ctx.db
    .query("users")
    .withIndex("by_wallet", q => q.eq("walletAddress", normalized))
    .first();
}

/** -------------------------------------------------------
 *  Require an existing user (throws if not found)
 * ------------------------------------------------------*/
export async function requireUserByWallet(ctx: QueryCtx | MutationCtx, address: string) {
  const user = await getUserByWallet(ctx, address);
  if (!user) throw new Error("User not found.");
  return user;
}

/** -------------------------------------------------------
 *  Permission Helpers
 * ------------------------------------------------------*/

export async function isOwner(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const group = await ctx.db.get(groupId);
  return group?.ownerId === userId;
}

export async function isAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const admin = await ctx.db
    .query("groupAdministrators")
    .withIndex("by_groupId", q => q.eq("groupId", groupId))
    .filter(q => q.eq(q.field("adminId"), userId))
    .first();

  return !!admin;
}

export async function isMember(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const membership = await ctx.db
    .query("userGroups")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .filter(q => q.eq(q.field("groupId"), groupId))
    .first();

  return !!membership;
}

/** -------------------------------------------------------
 *  Unified role checker
 * ------------------------------------------------------*/
export async function getUserRole(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  if (await isOwner(ctx, userId, groupId)) return "owner";
  if (await isAdmin(ctx, userId, groupId)) return "admin";
  if (await isMember(ctx, userId, groupId)) return "member";
  return "guest";
}

/** -------------------------------------------------------
 *  Authorization rules (RBAC)
 * ------------------------------------------------------*/

export async function assertCanManageCourses(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const role = await getUserRole(ctx, userId, groupId);

  if (role === "owner") return;
  if (role === "admin") return;

  throw new Error("Only owners or admins can manage courses.");
}

export async function assertCanPost(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const role = await getUserRole(ctx, userId, groupId);

  if (role === "owner") return;
  if (role === "admin") return;
  if (role === "member") return; // M1 enabled

  throw new Error("Only members can post.");
}

export async function assertCanComment(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  return assertCanPost(ctx, userId, groupId);
}

export async function assertCanModerateGroup(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">
) {
  const role = await getUserRole(ctx, userId, groupId);

  // admins can moderate members
  if (role === "owner") return;
  if (role === "admin") return;

  throw new Error("Insufficient permissions.");
}
