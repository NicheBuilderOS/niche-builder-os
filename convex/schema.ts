import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // ═══════════════════════════════
  // NICHES — the portfolio
  // ═══════════════════════════════
  niches: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("evaluating"),
      v.literal("launching"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("killed"),
    ),
    healthGrade: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D"),
      v.literal("F"),
      v.literal("-"),
    ),
    evalScore: v.number(),
    // Revenue & ROI
    totalRevenue: v.number(),
    totalSpend: v.number(),
    monthlyRevenue: v.number(),
    roi: v.number(),
    // Pipeline
    leadsTotal: v.number(),
    leadsQualified: v.number(),
    demosBooked: v.number(),
    dealsClosed: v.number(),
    // Meta
    launchedAt: v.optional(v.string()),
    lastAgentRun: v.optional(v.string()),
    geography: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    ownerId: v.id("users"),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_owner", ["ownerId"]),

  // ═══════════════════════════════
  // AGENTS — AI employees
  // ═══════════════════════════════
  agents: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.string(),
    schedule: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("error"),
    ),
    lastRunAt: v.optional(v.string()),
    nextRunAt: v.optional(v.string()),
    lastOutput: v.optional(v.string()),
    creditsUsed: v.number(),
    runsTotal: v.number(),
    icon: v.optional(v.string()),
  }).index("by_code", ["code"]),

  // ═══════════════════════════════
  // PIPELINE — leads per niche
  // ═══════════════════════════════
  leads: defineTable({
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
    createdAt: v.string(),
  })
    .index("by_niche", ["nicheId"])
    .index("by_stage", ["stage"]),

  // ═══════════════════════════════
  // METRICS — time-series data
  // ═══════════════════════════════
  metrics: defineTable({
    nicheId: v.optional(v.id("niches")),
    date: v.string(),
    revenue: v.number(),
    spend: v.number(),
    leads: v.number(),
    demos: v.number(),
    deals: v.number(),
  })
    .index("by_niche_date", ["nicheId", "date"])
    .index("by_date", ["date"]),

  // ═══════════════════════════════
  // ACTIVITY LOG
  // ═══════════════════════════════
  activityLog: defineTable({
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
    timestamp: v.string(),
  })
    .index("by_niche", ["nicheId"])
    .index("by_timestamp", ["timestamp"]),
});

export default schema;
