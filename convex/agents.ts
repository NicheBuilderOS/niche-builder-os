import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  returns: v.any(),
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
  },
});

export const toggleStatus = mutation({
  args: { id: v.id("agents") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error("Agent not found");
    const newStatus = agent.status === "active" ? "paused" : "active";
    await ctx.db.patch(id, { status: newStatus });
    return null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    description: v.string(),
    schedule: v.string(),
    icon: v.optional(v.string()),
  },
  returns: v.id("agents"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      status: "paused",
      creditsUsed: 0,
      runsTotal: 0,
      lastOutput: "Awaiting first run.",
    });
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});
