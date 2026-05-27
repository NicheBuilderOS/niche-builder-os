import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const create = mutation({
  args: {
    nicheId: v.id("niches"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.string(),
    stage: v.union(
      v.literal("new"),
      v.literal("qualified"),
      v.literal("demo"),
      v.literal("proposal"),
      v.literal("closed"),
      v.literal("lost"),
    ),
    value: v.number(),
    notes: v.optional(v.string()),
  },
  returns: v.id("leads"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateStage = mutation({
  args: {
    id: v.id("leads"),
    stage: v.union(
      v.literal("new"),
      v.literal("qualified"),
      v.literal("demo"),
      v.literal("proposal"),
      v.literal("closed"),
      v.literal("lost"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, { id, stage }) => {
    await ctx.db.patch(id, { stage });
    return null;
  },
});
