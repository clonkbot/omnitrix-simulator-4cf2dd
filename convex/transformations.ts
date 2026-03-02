import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const transform = mutation({
  args: {
    alienId: v.string(),
    alienName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    // Record transformation
    await ctx.db.insert("transformations", {
      userId,
      alienId: args.alienId,
      alienName: args.alienName,
      timestamp: Date.now(),
      duration: 0, // Will be updated when reverting
    });

    // Update profile
    await ctx.db.patch(profile._id, {
      currentAlien: args.alienId,
      totalTransformations: profile.totalTransformations + 1,
    });

    // Update leaderboard
    const leaderboardEntry = await ctx.db
      .query("leaderboard")
      .withIndex("by_transformations")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (leaderboardEntry) {
      await ctx.db.patch(leaderboardEntry._id, {
        totalTransformations: profile.totalTransformations + 1,
        lastActive: Date.now(),
      });
    }
  },
});

export const revert = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    // Get last transformation and update duration
    const lastTransformation = await ctx.db
      .query("transformations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    if (lastTransformation) {
      const duration = Math.floor((Date.now() - lastTransformation.timestamp) / 1000);
      await ctx.db.patch(lastTransformation._id, { duration });
    }

    await ctx.db.patch(profile._id, { currentAlien: undefined });
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("transformations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("leaderboard")
      .withIndex("by_transformations")
      .order("desc")
      .take(10);
  },
});
