/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chain from "../chain.js";
import type * as comments from "../comments.js";
import type * as config from "../config.js";
import type * as courses from "../courses.js";
import type * as encryptedCourses from "../encryptedCourses.js";
import type * as encryptedMetrics from "../encryptedMetrics.js";
import type * as groups from "../groups.js";
import type * as lessons from "../lessons.js";
import type * as likes from "../likes.js";
import type * as media from "../media.js";
import type * as memberships from "../memberships.js";
import type * as modules from "../modules.js";
import type * as posts from "../posts.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chain: typeof chain;
  comments: typeof comments;
  config: typeof config;
  courses: typeof courses;
  encryptedCourses: typeof encryptedCourses;
  encryptedMetrics: typeof encryptedMetrics;
  groups: typeof groups;
  lessons: typeof lessons;
  likes: typeof likes;
  media: typeof media;
  memberships: typeof memberships;
  modules: typeof modules;
  posts: typeof posts;
  users: typeof users;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
