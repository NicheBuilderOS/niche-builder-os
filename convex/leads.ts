import { v } from "convex/values";
import { query } from "./_generated/server";

export const byNiche = query({
  args: { nicheId: v.id("niches") },
  returns: v.any(),
  handler: async (ctx, { nicheId }) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .order("desc")
      .take(50);
  },
});

export const pipelineStats = query({
  args: { nicheId: v.id("niches") },
  returns: v.any(),
  handler: async (ctx, { nicheId }) => {
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();
    const stages = { new: 0, qualified: 0, demo: 0, proposal: 0, closed: 0, lost: 0 };
    for (const l of leads) {
      stages[l.stage] = (stages[l.stage] || 0) + 1;
    }
    const totalValue = leads
      .filter((l) => l.stage === "closed")
      .reduce((s, l) => s + l.value, 0);
    return { stages, totalValue, total: leads.length };
  },
});
