import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Users,
  Handshake,
  Rocket,
  ArrowRight,
  Activity,
  Bot,
  Clock,
} from "lucide-react";

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

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function StatCardComponent({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NicheCard({ niche }: { niche: any }) {
  return (
    <Link to={`/niche/${niche.slug}`} className="block group">
      <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200 h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{niche.icon || "🎯"}</div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {niche.name}
                </h3>
                <p className="text-xs text-muted-foreground">{niche.geography || "Global"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={gradeColors[niche.healthGrade]}>
                {niche.healthGrade === "-" ? "—" : niche.healthGrade}
              </Badge>
              <Badge variant="outline" className={statusColors[niche.status]}>
                {niche.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-semibold">{formatCurrency(niche.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="text-sm font-semibold">
                {niche.roi > 0 ? `${niche.roi}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deals</p>
              <p className="text-sm font-semibold">{niche.dealsClosed}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3" />
                {niche.leadsTotal} leads
              </span>
              <span className="flex items-center gap-1">
                <Handshake className="size-3" />
                {niche.demosBooked} demos
              </span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({ item }: { item: any }) {
  const iconMap: Record<string, React.ReactNode> = {
    agent_run: <Bot className="size-3.5 text-primary" />,
    deal_closed: <Handshake className="size-3.5 text-emerald-400" />,
    lead_created: <Users className="size-3.5 text-blue-400" />,
    niche_launched: <Rocket className="size-3.5 text-amber-400" />,
    niche_paused: <Clock className="size-3.5 text-muted-foreground" />,
    alert: <Activity className="size-3.5 text-red-400" />,
    system: <Activity className="size-3.5 text-muted-foreground" />,
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="mt-1">{iconMap[item.type] || <Activity className="size-3.5" />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">{item.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(item.timestamp)}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const stats = useQuery(api.niches.portfolioStats);
  const niches = useQuery(api.niches.list);
  const activity = useQuery(api.activity.recent, { limit: 8 });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            {stats?.activeNiches ?? 0} active niches • {stats?.totalNiches ?? 0} total
          </p>
        </div>
        <Button asChild>
          <Link to="/launch">
            <Rocket className="size-4 mr-2" />
            Launch Niche
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardComponent
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={DollarSign}
          subtitle="Across all niches"
        />
        <StatCardComponent
          title="Avg ROI"
          value={`${Math.round(stats?.avgRoi ?? 0)}%`}
          icon={TrendingUp}
          subtitle="Active niches"
        />
        <StatCardComponent
          title="Total Leads"
          value={String(stats?.totalLeads ?? 0)}
          icon={Users}
          subtitle="Pipeline"
        />
        <StatCardComponent
          title="Deals Closed"
          value={String(stats?.totalDeals ?? 0)}
          icon={Handshake}
          subtitle="All time"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Niches Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Your Niches</h2>
          {niches && niches.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {niches.map((niche: any) => (
                <NicheCard key={niche._id} niche={niche} />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Rocket className="size-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No niches yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Launch your first AI-powered niche business
                </p>
                <Button asChild>
                  <Link to="/launch">Launch Your First Niche</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              {activity && activity.length > 0 ? (
                activity.map((item: any) => (
                  <ActivityItem key={item._id} item={item} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No activity yet. Launch a niche to get started.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
