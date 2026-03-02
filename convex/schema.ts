import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User's unlocked aliens and preferences
  userProfiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    unlockedAliens: v.array(v.string()),
    currentAlien: v.optional(v.string()),
    totalTransformations: v.number(),
    favoriteAlien: v.optional(v.string()),
    omnitrixColor: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Transformation history
  transformations: defineTable({
    userId: v.id("users"),
    alienId: v.string(),
    alienName: v.string(),
    timestamp: v.number(),
    duration: v.number(), // in seconds
  }).index("by_user", ["userId"]).index("by_timestamp", ["timestamp"]),

  // Global leaderboard
  leaderboard: defineTable({
    userId: v.id("users"),
    username: v.string(),
    totalTransformations: v.number(),
    uniqueAliens: v.number(),
    lastActive: v.number(),
  }).index("by_transformations", ["totalTransformations"]),
});
