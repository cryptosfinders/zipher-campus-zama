import { defineApp } from "convex/server";
import { v } from "convex/values";

export default defineApp({
  functions: {
    "encryptedCourses:list": {
      handler: "encryptedCourses.list",
      args: {},
      public: true,
    },
    "encryptedCourses:listByUser": {
      handler: "encryptedCourses.listByUser",
      args: { address: v.string() },
      public: true,
    },
    "encryptedCourses:submit": {
      handler: "encryptedCourses.submit",
      args: {
        ciphertext: v.string(),
        address: v.string(),
        groupId: v.optional(v.id("groups")),
        courseId: v.optional(v.id("courses")),
      },
      public: true,
    },
  },
});

