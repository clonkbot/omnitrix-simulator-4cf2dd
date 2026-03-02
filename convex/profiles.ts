import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const DEFAULT_ALIENS = ["heatblast", "diamondhead", "xlr8", "grey_matter"];

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const createProfile = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      username: args.username,
      unlockedAliens: DEFAULT_ALIENS,
      currentAlien: undefined,
      totalTransformations: 0,
      favoriteAlien: undefined,
      omnitrixColor: "#00ff00",
      createdAt: Date.now(),
    });

    // Add to leaderboard
    await ctx.db.insert("leaderboard", {
      userId,
      username: args.username,
      totalTransformations: 0,
      uniqueAliens: DEFAULT_ALIENS.length,
      lastActive: Date.now(),
    });

    return profileId;
  },
});

export const updateOmnitrixColor = mutation({
  args: { color: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, { omnitrixColor: args.color });
  },
});

export const unlockAlien = mutation({
  args: { alienId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    if (!profile.unlockedAliens.includes(args.alienId)) {
      const newUnlocked = [...profile.unlockedAliens, args.alienId];
      await ctx.db.patch(profile._id, { unlockedAliens: newUnlocked });

      // Update leaderboard
      const leaderboardEntry = await ctx.db
        .query("leaderboard")
        .withIndex("by_transformations")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (leaderboardEntry) {
        await ctx.db.patch(leaderboardEntry._id, {
          uniqueAliens: newUnlocked.length,
        });
      }
    }
  },
});
