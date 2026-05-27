import { v } from "convex/values";
import { query } from "./_generated/server";

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
