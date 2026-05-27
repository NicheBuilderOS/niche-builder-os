import { useQuery } from "convex/react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Activity,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const gradeColors: Record<string, string> = {
  A: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  B: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  C: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  D: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  F: "bg-red-500/10 text-red-500 border-red-500/20",
  "-": "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  launching: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  evaluating: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  paused: "bg-muted text-muted-foreground border-border",
  killed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const stageLabels: Record<string, string> = {
  new: "New",
  qualified: "Qualified",
  demo: "Demo",
  proposal: "Proposal",
  closed: "Closed",
  lost: "Lost",
};

const stageColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  demo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  proposal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  closed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function FunnelBar({ stage, count, total }: { stage: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 text-right">{stageLabels[stage]}</span>
      <div className="flex-1 h-6 rounded bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded bg-primary/60 transition-all"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8">{count}</span>
    </div>
  );
}

export function NicheDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const niche = useQuery(api.niches.getBySlug, { slug: slug ?? "" });
  const leads = useQuery(
    api.leads.byNiche,
    niche?._id ? { nicheId: niche._id } : "skip",
  );
  const pipeline = useQuery(
    api.leads.pipelineStats,
    niche?._id ? { nicheId: niche._id } : "skip",
  );
  const activity = useQuery(
    api.activity.byNiche,
    niche?._id ? { nicheId: niche._id } : "skip",
  );

  if (niche === undefined) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-96" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (niche === null) {
    return (
      <div className="p-6 text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Niche not found</h2>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{niche.icon || "🎯"}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{niche.name}</h1>
                <Badge variant="outline" className={gradeColors[niche.healthGrade]}>
                  Grade {niche.healthGrade}
                </Badge>
                <Badge variant="outline" className={statusColors[niche.status]}>
                  {niche.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{niche.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {niche.status === "active" && (
            <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>
              <Pause className="size-4 mr-1" />
              Pause
            </Button>
          )}
          {niche.status === "paused" && (
            <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>
              <Play className="size-4 mr-1" />
              Resume
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.info("Feature coming soon")}>
            <Trash2 className="size-4 mr-1" />
            Kill
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(niche.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(niche.monthlyRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">ROI</p>
            <p className="text-xl font-bold">{niche.roi > 0 ? `${niche.roi}%` : "—"}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Eval Score</p>
            <p className="text-xl font-bold">{niche.evalScore.toFixed(1)}/5</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Spend</p>
            <p className="text-xl font-bold">{formatCurrency(niche.totalSpend)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pipeline?.stages &&
                  Object.entries(pipeline.stages)
                    .filter(([k]) => k !== "lost")
                    .map(([stage, count]) => (
                      <FunnelBar
                        key={stage}
                        stage={stage}
                        count={count as number}
                        total={pipeline.total}
                      />
                    ))}
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Pipeline Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold">{niche.leadsTotal}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground">Qualified</p>
                    <p className="text-2xl font-bold">{niche.leadsQualified}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground">Demos Booked</p>
                    <p className="text-2xl font-bold">{niche.demosBooked}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground">Closed Value</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(pipeline?.totalValue ?? 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="mt-4">
          <Card className="bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Source</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Stage</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads?.map((lead: any) => (
                      <tr key={lead._id} className="border-b border-border/50 hover:bg-muted/10">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">{lead.source}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={stageColors[lead.stage]}>
                            {stageLabels[lead.stage]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{formatCurrency(lead.value)}</td>
                      </tr>
                    ))}
                    {(!leads || leads.length === 0) && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                          No leads yet for this niche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              {activity && activity.length > 0 ? (
                activity.map((item: any) => (
                  <div key={item._id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                    <Activity className="size-3.5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No activity for this niche yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
