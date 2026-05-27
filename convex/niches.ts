import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("niches")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.any(),
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("niches")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    geography: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  returns: v.id("niches"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("niches", {
      ...args,
      status: "evaluating",
      healthGrade: "-",
      evalScore: 0,
      totalRevenue: 0,
      totalSpend: 0,
      monthlyRevenue: 0,
      roi: 0,
      leadsTotal: 0,
      leadsQualified: 0,
      demosBooked: 0,
      dealsClosed: 0,
      ownerId: userId,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("niches"),
    status: v.union(
      v.literal("evaluating"),
      v.literal("launching"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("killed"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("niches") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    // Delete associated leads
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_niche", (q) => q.eq("nicheId", id))
      .collect();
    for (const lead of leads) {
      await ctx.db.delete(lead._id);
    }
    // Delete associated activity
    const activities = await ctx.db
      .query("activityLog")
      .withIndex("by_niche", (q) => q.eq("nicheId", id))
      .collect();
    for (const act of activities) {
      await ctx.db.delete(act._id);
    }
    // Delete niche
    await ctx.db.delete(id);
    return null;
  },
});

export const portfolioStats = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return {
        totalRevenue: 0,
        totalNiches: 0,
        activeNiches: 0,
        totalLeads: 0,
        totalDeals: 0,
        avgRoi: 0,
      };
    const niches = await ctx.db
      .query("niches")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
    const active = niches.filter((n) => n.status === "active");
    const totalRevenue = niches.reduce((s, n) => s + n.totalRevenue, 0);
    const totalLeads = niches.reduce((s, n) => s + n.leadsTotal, 0);
    const totalDeals = niches.reduce((s, n) => s + n.dealsClosed, 0);
    const avgRoi =
      active.length > 0
        ? active.reduce((s, n) => s + n.roi, 0) / active.length
        : 0;
    return {
      totalRevenue,
      totalNiches: niches.length,
      activeNiches: active.length,
      totalLeads,
      totalDeals,
      avgRoi,
    };
  },
});
