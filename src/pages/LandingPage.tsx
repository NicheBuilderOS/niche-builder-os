import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  Globe,
  Rocket,
  Search,
  Shield,
  Zap,
} from "lucide-react";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gradient">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="size-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ComparisonRow({
  feature,
  us,
  them,
}: {
  feature: string;
  us: string;
  them: string;
}) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm font-medium">{feature}</td>
      <td className="py-3 px-4 text-sm text-primary font-semibold">{us}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{them}</td>
    </tr>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="relative container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
              <Zap className="size-3.5" />
              AI-Powered Business Automation
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Launch Autonomous{" "}
              <span className="text-gradient">AI Businesses</span>
              <br />
              That Actually Make Money
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We don't sell tools. We launch full businesses — with AI agents that research
              markets, build infrastructure, create content, run ads, and close deals.
              Autonomously.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8 h-12">
                <Link to="/signup">
                  Launch Your First Niche
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="70+" label="Niches Available" />
            <StatCard value="8" label="AI Agents" />
            <StatCard value="462%" label="Avg ROI" />
            <StatCard value="$0" label="Monthly Fee" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not a Tool. A <span className="text-gradient">Business Operating System.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            8 AI agents work 24/7 across your entire portfolio — researching, building, creating, selling, and optimizing.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Search}
            title="Truth Engine"
            description="300+ data points per niche. Competitor ads, pricing, market gaps, and customer pain points — scraped and analyzed in real-time."
          />
          <FeatureCard
            icon={Rocket}
            title="16-Step Launch"
            description="From evaluation to live business in one pipeline. CRM, landing pages, email sequences, ad campaigns — all built automatically."
          />
          <FeatureCard
            icon={Bot}
            title="8 AI Agents"
            description="Atlas, Herald, Scout, Forge, Sentinel, Darwin, Banker, Amplifier — each with specialized skills running on scheduled crons."
          />
          <FeatureCard
            icon={ChartNoAxesCombined}
            title="Portfolio Dashboard"
            description="Manage multiple niches from one screen. Health grades, ROI tracking, pipeline funnels, and one-click scaling decisions."
          />
          <FeatureCard
            icon={Globe}
            title="Multi-Channel Outreach"
            description="Email, SMS, WhatsApp, Meta Ads, Google Ads, LinkedIn, and AI voice — all orchestrated by your agents across every niche."
          />
          <FeatureCard
            icon={Shield}
            title="Self-Improving"
            description="Darwin agent analyzes what works, updates strategies, and optimizes workflows. The system gets smarter with every launch."
          />
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="border-t border-border bg-card/20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We <span className="text-gradient">Stack Up</span>
            </h2>
            <p className="text-muted-foreground">Data-driven comparison. Not marketing fluff.</p>
          </div>
          <div className="max-w-3xl mx-auto overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-primary">Niche Builder OS</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Others</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Multi-Niche Portfolio" us="✓ Unlimited" them="✗ Single client" />
                <ComparisonRow feature="AI Agents" us="8 specialized" them="Generic chatbot" />
                <ComparisonRow feature="Self-Improving" us="✓ Darwin agent" them="✗ Static" />
                <ComparisonRow feature="Setup Cost" us="Free" them="$25,000" />
                <ComparisonRow feature="Monthly Cost" us="Pay-per-use" them="$5,000/mo" />
                <ComparisonRow feature="Launch Time" us="< 24 hours" them="2-4 weeks" />
                <ComparisonRow feature="Integrations" us="3,233+" them="~100" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative max-w-3xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start with one niche. Scale to dozens. Let AI agents do the work while you focus on strategy.
          </p>
          <Button size="lg" asChild className="text-base px-8 h-12">
            <Link to="/signup">
              Get Started Free
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Zap className="size-3 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">Niche Builder OS</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Niche Builder OS. Built with AI, for AI businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
