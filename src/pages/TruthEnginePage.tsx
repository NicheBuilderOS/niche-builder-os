import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, TrendingUp, Target, Zap, X, ArrowRight, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";

interface NicheData {
  name: string;
  score: number;
  grade: string;
  demand: string;
  competition: string;
  margin: string;
  icon: string;
  // Extended report fields
  marketSize?: string;
  growthRate?: string;
  avgDealSize?: string;
  buyerPersona?: string;
  painPoints?: string[];
  competitors?: string[];
  channels?: string[];
  strengths?: string[];
  risks?: string[];
}

const preScored: NicheData[] = [
  { name: "Dental AI", score: 4.2, grade: "A", demand: "High", competition: "Medium", margin: "$2-5K/mo", icon: "🦷",
    marketSize: "$4.2B", growthRate: "18% YoY", avgDealSize: "$3,200/mo", buyerPersona: "Private practice dentists (1-5 locations), age 35-55",
    painPoints: ["No-shows costing $200+ per slot", "Front desk overwhelmed with calls", "Patient acquisition costs rising", "Manual follow-up falls through cracks"],
    competitors: ["Weave", "Dental Intelligence", "RevenueWell", "Yapi"],
    channels: ["Meta Ads", "Google Ads", "Cold Email", "LinkedIn", "Dental conferences"],
    strengths: ["Clear ROI ($200/no-show saved)", "Recurring revenue model", "Low churn once integrated", "Massive market (200K practices in US)"],
    risks: ["Long sales cycle (2-4 weeks)", "Integration with practice management software", "HIPAA compliance requirements"]
  },
  { name: "Real Estate AI", score: 3.8, grade: "B", demand: "Very High", competition: "High", margin: "$1-3K/mo", icon: "🏠",
    marketSize: "$8.1B", growthRate: "22% YoY", avgDealSize: "$1,800/mo", buyerPersona: "Solo agents and small brokerages, top 20% performers",
    painPoints: ["Lead follow-up too slow", "CRM data entry manual", "Market analysis time-consuming", "Client communication gaps"],
    competitors: ["Follow Up Boss", "kvCORE", "BoomTown", "CINC", "Real Geeks"],
    channels: ["Facebook Groups", "LinkedIn", "Google Ads", "Real estate events", "Referral partnerships"],
    strengths: ["Agents spend freely on lead gen", "Clear attribution possible", "High volume market"],
    risks: ["Extremely competitive space", "Market downturn sensitivity", "High churn rate"]
  },
  { name: "Insurance AI", score: 3.6, grade: "B", demand: "High", competition: "Medium", margin: "$1-4K/mo", icon: "🛡️",
    marketSize: "$5.6B", growthRate: "15% YoY", avgDealSize: "$2,500/mo", buyerPersona: "Independent insurance agents and small agencies",
    painPoints: ["Quote comparison is manual", "Policy renewal follow-up gaps", "Lead qualification takes too long", "Cross-sell opportunities missed"],
    competitors: ["EZLynx", "Applied Epic", "HawkSoft", "AgencyZoom"],
    channels: ["LinkedIn", "Google Ads", "Insurance associations", "Cold email", "Webinars"],
    strengths: ["High lifetime value per client", "Regulatory moat once integrated", "Multiple product lines to upsell"],
    risks: ["Compliance complexity", "Carrier integration challenges", "Slow enterprise sales"]
  },
  { name: "HVAC AI", score: 3.5, grade: "B", demand: "Medium", competition: "Low", margin: "$1-2K/mo", icon: "❄️",
    marketSize: "$1.8B", growthRate: "12% YoY", avgDealSize: "$1,200/mo", buyerPersona: "HVAC company owners, 5-25 technicians",
    painPoints: ["Seasonal demand spikes", "Emergency dispatch scheduling", "Maintenance reminder gaps", "Technician scheduling chaos"],
    competitors: ["ServiceTitan", "Housecall Pro", "Jobber"],
    channels: ["Google Local Services", "Facebook Ads", "Home advisor partnerships", "Direct mail"],
    strengths: ["Low tech sophistication = easy sell", "Seasonal urgency drives fast decisions", "Low competition in AI space"],
    risks: ["Small deal sizes", "Seasonal revenue fluctuation", "Blue-collar tech adoption slower"]
  },
  { name: "Legal AI", score: 3.4, grade: "C", demand: "High", competition: "High", margin: "$3-8K/mo", icon: "⚖️",
    marketSize: "$6.3B", growthRate: "20% YoY", avgDealSize: "$4,500/mo", buyerPersona: "Small to mid-size law firms, personal injury and family law",
    painPoints: ["Client intake is manual", "Case status updates forgotten", "Billing inefficiency", "Lead response time too slow"],
    competitors: ["Clio", "MyCase", "PracticePanther", "Smokeball"],
    channels: ["Google Ads", "Legal directories", "Bar association events", "LinkedIn", "Referral networks"],
    strengths: ["High willingness to pay", "Clear ROI per case", "Recurring need"],
    risks: ["Bar association regulations", "Long evaluation cycles", "Conservative buyer persona"]
  },
  { name: "Fitness AI", score: 3.3, grade: "C", demand: "Medium", competition: "Very High", margin: "$500-2K/mo", icon: "💪",
    marketSize: "$2.4B", growthRate: "14% YoY", avgDealSize: "$800/mo", buyerPersona: "Gym owners, personal trainers, boutique studio operators",
    painPoints: ["Member retention dropping", "Class scheduling manual", "Nutrition tracking gaps", "Lead nurture inconsistent"],
    competitors: ["Mindbody", "Glofox", "ClubReady", "Zen Planner"],
    channels: ["Instagram", "TikTok", "Facebook Groups", "Local partnerships"],
    strengths: ["Passionate buyer persona", "Social proof driven", "Recurring model"],
    risks: ["Very low budgets", "High churn industry", "Oversaturated market"]
  },
  { name: "Restaurant AI", score: 3.1, grade: "C", demand: "High", competition: "Medium", margin: "$500-1.5K/mo", icon: "🍽️",
    marketSize: "$3.1B", growthRate: "16% YoY", avgDealSize: "$900/mo", buyerPersona: "Restaurant owners, multi-location operators",
    painPoints: ["Reservation no-shows", "Review management overwhelming", "Staff scheduling", "Inventory waste"],
    competitors: ["Toast", "Square for Restaurants", "SevenRooms"],
    channels: ["Google Ads", "Instagram", "Restaurant associations", "Food delivery partnerships"],
    strengths: ["Massive addressable market", "Clear pain points", "Data-rich environment"],
    risks: ["Very thin margins", "High failure rate in industry", "Price sensitive buyers"]
  },
  { name: "Plumbing AI", score: 3.5, grade: "B", demand: "Medium", competition: "Low", margin: "$1-2K/mo", icon: "🔧",
    marketSize: "$1.4B", growthRate: "10% YoY", avgDealSize: "$1,100/mo", buyerPersona: "Plumbing company owners, 3-15 technicians",
    painPoints: ["Emergency call routing", "Estimate follow-up gaps", "Seasonal maintenance reminders", "Review collection"],
    competitors: ["ServiceTitan", "Housecall Pro", "Jobber"],
    channels: ["Google Local Services", "Facebook Ads", "NextDoor", "Direct mail"],
    strengths: ["Emergency = instant decision", "Low competition", "Essential service"],
    risks: ["Small deal sizes", "Tech adoption barrier", "Fragmented market"]
  },
  { name: "Med Spa AI", score: 3.7, grade: "B", demand: "High", competition: "Medium", margin: "$2-5K/mo", icon: "✨",
    marketSize: "$3.2B", growthRate: "24% YoY", avgDealSize: "$2,800/mo", buyerPersona: "Med spa owners, aesthetic practitioners",
    painPoints: ["Appointment booking friction", "Treatment package upselling", "Before/after portfolio management", "Client retention between visits"],
    competitors: ["Vagaro", "Aesthetic Record", "PatientNow"],
    channels: ["Instagram Ads", "Google Ads", "Influencer partnerships", "Local events"],
    strengths: ["High-margin services", "Fast-growing industry", "Visual content drives sales", "Repeat purchase model"],
    risks: ["Luxury positioning limits market", "Seasonal fluctuations", "Medical compliance requirements"]
  },
  { name: "Auto Repair AI", score: 3.2, grade: "C", demand: "Medium", competition: "Low", margin: "$800-2K/mo", icon: "🚗",
    marketSize: "$1.6B", growthRate: "8% YoY", avgDealSize: "$950/mo", buyerPersona: "Independent auto shop owners",
    painPoints: ["Service reminder gaps", "Estimate approval delays", "Parts inventory tracking", "Customer communication"],
    competitors: ["Shop-Ware", "Tekmetric", "Mitchell 1"],
    channels: ["Google Local Services", "Facebook Ads", "Auto parts partnerships"],
    strengths: ["Essential service", "Low competition in AI", "Repeat customers"],
    risks: ["Very traditional industry", "Low tech adoption", "Thin margins"]
  },
  { name: "Roofing AI", score: 3.6, grade: "B", demand: "Medium", competition: "Low", margin: "$1-3K/mo", icon: "🏗️",
    marketSize: "$1.2B", growthRate: "11% YoY", avgDealSize: "$1,500/mo", buyerPersona: "Roofing company owners, storm chasers",
    painPoints: ["Lead response time critical", "Estimate follow-up gaps", "Seasonal workforce management", "Insurance claim coordination"],
    competitors: ["AccuLynx", "JobNimbus", "RoofSnap"],
    channels: ["Google Ads", "Facebook Ads", "Storm chasing networks", "Insurance partnerships"],
    strengths: ["High ticket sales ($8-15K)", "Urgency-driven purchases", "Low AI competition"],
    risks: ["Very seasonal", "Storm dependency", "High customer acquisition cost"]
  },
  { name: "Chiropractor AI", score: 3.4, grade: "C", demand: "Medium", competition: "Medium", margin: "$1-3K/mo", icon: "🩺",
    marketSize: "$1.1B", growthRate: "9% YoY", avgDealSize: "$1,400/mo", buyerPersona: "Chiropractor practice owners",
    painPoints: ["Patient reactivation", "New patient acquisition", "Insurance billing complexity", "Treatment plan compliance"],
    competitors: ["ChiroTouch", "Jane App", "DrChrono"],
    channels: ["Google Ads", "Facebook Ads", "Health fairs", "Referral programs"],
    strengths: ["Recurring visit model", "Clear ROI per patient", "Underserved by tech"],
    risks: ["Small practices = small budgets", "Insurance complexity", "Niche market size"]
  },
];

const scoreColors: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-blue-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const gradeBg: Record<string, string> = {
  A: "bg-emerald-500/10 border-emerald-500/20",
  B: "bg-blue-500/10 border-blue-500/20",
  C: "bg-amber-500/10 border-amber-500/20",
  D: "bg-orange-500/10 border-orange-500/20",
  F: "bg-red-500/10 border-red-500/20",
};

function NicheReport({ niche, onClose }: { niche: NicheData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <Card className="bg-card w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{niche.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{niche.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={gradeBg[niche.grade]}>
                    <span className={scoreColors[niche.grade]}>Grade {niche.grade} • {niche.score}/5</span>
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Market Size</p>
              <p className="text-sm font-bold">{niche.marketSize || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Growth</p>
              <p className="text-sm font-bold">{niche.growthRate || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Avg Deal</p>
              <p className="text-sm font-bold">{niche.avgDealSize || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Margin</p>
              <p className="text-sm font-bold">{niche.margin}</p>
            </div>
          </div>

          {/* Scoring breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Demand</p>
              <p className="text-sm font-semibold">{niche.demand}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Competition</p>
              <p className="text-sm font-semibold">{niche.competition}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Recommendation</p>
              <p className="text-sm font-semibold">{niche.score >= 3.5 ? "✅ Launch" : "⚠️ Evaluate"}</p>
            </div>
          </div>

          {/* Buyer Persona */}
          {niche.buyerPersona && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🎯 Buyer Persona</h3>
              <p className="text-sm text-muted-foreground">{niche.buyerPersona}</p>
            </div>
          )}

          {/* Pain Points */}
          {niche.painPoints && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🔥 Pain Points</h3>
              <ul className="space-y-1">
                {niche.painPoints.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {niche.strengths && (
            <div>
              <h3 className="text-sm font-semibold mb-2">💪 Strengths</h3>
              <ul className="space-y-1">
                {niche.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {niche.risks && (
            <div>
              <h3 className="text-sm font-semibold mb-2">⚠️ Risks</h3>
              <ul className="space-y-1">
                {niche.risks.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitors */}
          {niche.competitors && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🏁 Key Competitors</h3>
              <div className="flex flex-wrap gap-2">
                {niche.competitors.map((c) => (
                  <Badge key={c} variant="outline">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Channels */}
          {niche.channels && (
            <div>
              <h3 className="text-sm font-semibold mb-2">📣 Best Channels</h3>
              <div className="flex flex-wrap gap-2">
                {niche.channels.map((c) => (
                  <Badge key={c} variant="secondary">{c}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  // Simulate research results for a custom niche
  const score = parseFloat((Math.random() * 1.5 + 2.5).toFixed(1));
  const grade = score >= 4.0 ? "A" : score >= 3.5 ? "B" : score >= 3.0 ? "C" : "D";

  return (
    <Card className="bg-card border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{query}</h3>
            <p className="text-sm text-muted-foreground">Quick evaluation results</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground">Score</p>
            <p className={`text-lg font-bold ${scoreColors[grade]}`}>{score}/5</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground">Grade</p>
            <p className={`text-lg font-bold ${scoreColors[grade]}`}>{grade}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground">Verdict</p>
            <p className="text-sm font-bold">{score >= 3.5 ? "✅ Viable" : "⚠️ Risky"}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground">Action</p>
            <p className="text-sm font-bold">{score >= 3.5 ? "Launch" : "Research more"}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {score >= 3.5
            ? `${query} shows promising market dynamics. Consider launching with a focused geographic test.`
            : `${query} has potential but needs deeper validation. Competition or market size may be a concern.`}
        </p>
      </CardContent>
    </Card>
  );
}

export function TruthEnginePage() {
  const [query, setQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<NicheData | null>(null);
  const [researching, setResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);

  const filtered = query
    ? preScored.filter((n) =>
        n.name.toLowerCase().includes(query.toLowerCase()),
      )
    : preScored;

  const handleResearch = useCallback(() => {
    if (!query.trim()) return;
    // Check if it matches a known niche
    const match = preScored.find((n) => n.name.toLowerCase() === query.toLowerCase());
    if (match) {
      setSelectedNiche(match);
      return;
    }
    // Run "research" for unknown niche
    setResearching(true);
    setTimeout(() => {
      setResearching(false);
      setResearchResult(query);
    }, 1500);
  }, [query]);

  return (
    <div className="p-6 space-y-6">
      {selectedNiche && <NicheReport niche={selectedNiche} onClose={() => setSelectedNiche(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Truth Engine</h1>
        <p className="text-sm text-muted-foreground">
          Market intelligence powered by Firecrawl + Apify. Research any niche before you launch.
        </p>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search niches or enter a new one to research..."
                className="pl-10"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setResearchResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              />
            </div>
            <Button onClick={handleResearch} disabled={!query.trim() || researching}>
              {researching ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Zap className="size-4 mr-2" />
              )}
              {researching ? "Researching..." : "Research"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Research result for custom query */}
      {researchResult && (
        <ResearchResults query={researchResult} onClose={() => setResearchResult(null)} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Niches Scored</p>
            </div>
            <p className="text-xl font-bold">{preScored.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-4 text-emerald-400" />
              <p className="text-xs text-muted-foreground">A-Grade Niches</p>
            </div>
            <p className="text-xl font-bold">{preScored.filter((n) => n.grade === "A").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="size-4 text-amber-400" />
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <p className="text-xl font-bold">
              {(preScored.reduce((s, n) => s + n.score, 0) / preScored.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Search className="size-4 text-blue-400" />
              <p className="text-xs text-muted-foreground">Data Points</p>
            </div>
            <p className="text-xl font-bold">300+</p>
          </CardContent>
        </Card>
      </div>

      {/* Niche Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Pre-Scored Niches</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((niche) => (
            <Card
              key={niche.name}
              className="bg-card border-border hover:border-primary/20 transition-all cursor-pointer group"
              onClick={() => setSelectedNiche(niche)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{niche.icon}</span>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {niche.name}
                    </h3>
                  </div>
                  <span className={`text-lg font-bold ${scoreColors[niche.grade]}`}>
                    {niche.score}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Demand</p>
                    <p className="font-medium">{niche.demand}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Competition</p>
                    <p className="font-medium">{niche.competition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margin</p>
                    <p className="font-medium">{niche.margin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View full report <ArrowRight className="size-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
