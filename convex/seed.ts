import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const seedDemoData = internalMutation({
  args: { ownerId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { ownerId }) => {
    // Check if already seeded
    const existing = await ctx.db
      .query("niches")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .first();
    if (existing) return null;

    // ═══ NICHES ═══
    const dentalId = await ctx.db.insert("niches", {
      name: "Dental AI",
      slug: "dental-ai",
      description: "AI-powered patient acquisition for dental practices. Automated outreach, appointment booking, and follow-up.",
      status: "active",
      healthGrade: "A",
      evalScore: 4.2,
      totalRevenue: 47200,
      totalSpend: 8400,
      monthlyRevenue: 12800,
      roi: 462,
      leadsTotal: 342,
      leadsQualified: 89,
      demosBooked: 34,
      dealsClosed: 12,
      launchedAt: "2026-05-01",
      lastAgentRun: new Date().toISOString(),
      geography: "US - National",
      icon: "🦷",
      color: "#6366f1",
      ownerId,
    });

    const realEstateId = await ctx.db.insert("niches", {
      name: "Real Estate AI",
      slug: "real-estate-ai",
      description: "AI lead gen and nurture for real estate agents. Property matching, automated follow-up, and deal tracking.",
      status: "active",
      healthGrade: "B",
      evalScore: 3.8,
      totalRevenue: 23100,
      totalSpend: 6200,
      monthlyRevenue: 8500,
      roi: 273,
      leadsTotal: 218,
      leadsQualified: 52,
      demosBooked: 18,
      dealsClosed: 7,
      launchedAt: "2026-05-10",
      lastAgentRun: new Date().toISOString(),
      geography: "US - FL, TX, CA",
      icon: "🏠",
      color: "#8b5cf6",
      ownerId,
    });

    const insuranceId = await ctx.db.insert("niches", {
      name: "Insurance AI",
      slug: "insurance-ai",
      description: "AI-driven insurance lead qualification and policy matching. Automated quoting and follow-up sequences.",
      status: "launching",
      healthGrade: "-",
      evalScore: 3.6,
      totalRevenue: 0,
      totalSpend: 1200,
      monthlyRevenue: 0,
      roi: 0,
      leadsTotal: 45,
      leadsQualified: 8,
      demosBooked: 2,
      dealsClosed: 0,
      launchedAt: "2026-05-24",
      lastAgentRun: new Date().toISOString(),
      geography: "US - National",
      icon: "🛡️",
      color: "#22c55e",
      ownerId,
    });

    await ctx.db.insert("niches", {
      name: "HVAC AI",
      slug: "hvac-ai",
      description: "AI service booking and lead gen for HVAC companies. Seasonal campaigns, emergency dispatch, and maintenance reminders.",
      status: "evaluating",
      healthGrade: "-",
      evalScore: 3.5,
      totalRevenue: 0,
      totalSpend: 0,
      monthlyRevenue: 0,
      roi: 0,
      leadsTotal: 0,
      leadsQualified: 0,
      demosBooked: 0,
      dealsClosed: 0,
      geography: "US - Southeast",
      icon: "❄️",
      color: "#eab308",
      ownerId,
    });

    // ═══ AGENTS ═══
    const agentData = [
      { name: "Atlas", code: "ATLAS", description: "Portfolio health brief — daily overview of all niches, KPIs, and alerts", schedule: "Daily 8:00 AM", status: "active" as const, creditsUsed: 1240, runsTotal: 27, icon: "🌍" },
      { name: "Herald", code: "HERALD", description: "Content & creative engine — generates posts, ad copy, and creative assets per niche", schedule: "Daily 7:00 AM", status: "active" as const, creditsUsed: 3420, runsTotal: 27, icon: "📢" },
      { name: "Scout", code: "SCOUT", description: "Truth Engine — competitor research, market intel, ad scraping, opportunity finder", schedule: "Sunday 6:00 PM", status: "active" as const, creditsUsed: 2180, runsTotal: 4, icon: "🔍" },
      { name: "Darwin", code: "DARWIN", description: "Self-improvement — analyzes agent performance, updates strategies, optimizes workflows", schedule: "Sunday 9:00 PM", status: "active" as const, creditsUsed: 890, runsTotal: 4, icon: "🧬" },
      { name: "Forge", code: "FORGE", description: "Launch engine — 16-step niche deployment pipeline from eval to verification", schedule: "On-demand", status: "active" as const, creditsUsed: 4560, runsTotal: 3, icon: "⚒️" },
      { name: "Sentinel", code: "SENTINEL", description: "Competitive monitor — tracks competitor ads, pricing, and market shifts", schedule: "Wednesday 10:00 AM", status: "active" as const, creditsUsed: 1560, runsTotal: 8, icon: "🛡️" },
      { name: "Banker", code: "BANKER", description: "ROI audit — revenue tracking, cost analysis, and profitability reporting", schedule: "Monday 9:00 AM", status: "active" as const, creditsUsed: 670, runsTotal: 4, icon: "💰" },
      { name: "Amplifier", code: "AMPLIFIER", description: "Auto-scale — identifies winners, increases budgets, pauses underperformers", schedule: "Monday 11:00 AM", status: "paused" as const, creditsUsed: 340, runsTotal: 2, icon: "📈" },
    ];

    for (const agent of agentData) {
      await ctx.db.insert("agents", {
        ...agent,
        lastRunAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        nextRunAt: new Date(Date.now() + Math.random() * 86400000 * 3).toISOString(),
        lastOutput: `Completed successfully. Processed ${Math.floor(Math.random() * 50 + 10)} items.`,
      });
    }

    // ═══ LEADS (for Dental AI) ═══
    const leadNames = [
      "Dr. Sarah Mitchell", "Dr. James Park", "Dr. Lisa Chen", "Dr. Michael Torres",
      "Dr. Amanda Hughes", "Dr. Robert Kim", "Dr. Emily Davis", "Dr. Brian Wilson",
      "Dr. Jennifer Lopez", "Dr. David Patel", "Dr. Rachel Green", "Dr. Kevin Brown",
    ];
    const stages: Array<"new" | "qualified" | "demo" | "proposal" | "closed" | "lost"> = ["new", "qualified", "demo", "proposal", "closed", "lost"];
    const sources = ["Meta Ad", "Google Ad", "Cold Email", "LinkedIn", "Referral", "Website"];

    for (let i = 0; i < leadNames.length; i++) {
      const stage = stages[i % stages.length];
      await ctx.db.insert("leads", {
        nicheId: dentalId,
        name: leadNames[i],
        email: `${leadNames[i].toLowerCase().replace(/[^a-z]/g, ".")}@example.com`,
        phone: `+1555${String(Math.floor(Math.random() * 9000000 + 1000000))}`,
        source: sources[i % sources.length],
        stage,
        value: stage === "closed" ? Math.floor(Math.random() * 5000 + 2000) : Math.floor(Math.random() * 3000 + 500),
        notes: stage === "closed" ? "Deal closed. Monthly retainer started." : undefined,
        createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      });
    }

    // ═══ ACTIVITY LOG ═══
    const activities = [
      { type: "agent_run" as const, agentCode: "ATLAS", message: "Atlas completed daily portfolio brief. All niches healthy." },
      { type: "deal_closed" as const, nicheId: dentalId, message: "New deal closed: Dr. Sarah Mitchell — $3,200/mo retainer" },
      { type: "lead_created" as const, nicheId: dentalId, message: "New lead from Meta Ad: Dr. Kevin Brown, Smile Dental Center" },
      { type: "agent_run" as const, agentCode: "HERALD", message: "Herald generated 12 social posts + 4 ad creatives for Dental AI" },
      { type: "agent_run" as const, agentCode: "SCOUT", message: "Scout completed truth engine scan. Found 3 new competitor ads." },
      { type: "niche_launched" as const, nicheId: insuranceId, message: "Insurance AI niche launch initiated — step 4/16" },
      { type: "lead_created" as const, nicheId: realEstateId, message: "New lead from Google Ad: Mark Johnson, Johnson Realty Group" },
      { type: "agent_run" as const, agentCode: "BANKER", message: "Weekly ROI audit complete. Dental AI ROI: 462%. Portfolio healthy." },
      { type: "alert" as const, message: "Credit balance below 40K — WARNING level. Consider reducing HERALD frequency." },
      { type: "system" as const, message: "System started. All 7 active agents online." },
    ];

    for (let i = 0; i < activities.length; i++) {
      await ctx.db.insert("activityLog", {
        ...activities[i],
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      });
    }

    // ═══ METRICS (last 14 days for Dental AI) ═══
    for (let d = 13; d >= 0; d--) {
      const date = new Date(Date.now() - d * 86400000);
      const dateStr = date.toISOString().slice(0, 10);
      await ctx.db.insert("metrics", {
        nicheId: dentalId,
        date: dateStr,
        revenue: Math.floor(Math.random() * 2000 + 500),
        spend: Math.floor(Math.random() * 400 + 200),
        leads: Math.floor(Math.random() * 15 + 5),
        demos: Math.floor(Math.random() * 4 + 1),
        deals: Math.random() > 0.6 ? 1 : 0,
      });
    }

    return null;
  },
});
