import { v } from "convex/values";
import { query } from "./_generated/server";

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
