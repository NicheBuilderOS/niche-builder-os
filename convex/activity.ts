import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const recent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.any(),
  handler: async (ctx, { limit }) => {
    const results = await ctx.db
      .query("activityLog")
      .order("desc")
      .take(limit ?? 20);
    return results;
  },
});

export const byNiche = query({
  args: { nicheId: v.id("niches") },
  returns: v.any(),
  handler: async (ctx, { nicheId }) => {
    return await ctx.db
      .query("activityLog")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .order("desc")
      .take(30);
  },
});

export const log = mutation({
  args: {
    nicheId: v.optional(v.id("niches")),
    agentCode: v.optional(v.string()),
    type: v.union(
      v.literal("agent_run"),
      v.literal("lead_created"),
      v.literal("deal_closed"),
      v.literal("niche_launched"),
      v.literal("niche_paused"),
      v.literal("alert"),
      v.literal("system"),
    ),
    message: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      ...args,
      timestamp: new Date().toISOString(),
    });
    return null;
  },
});
