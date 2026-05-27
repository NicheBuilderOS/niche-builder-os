import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, TrendingUp, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const preScored = [
  { name: "Dental AI", score: 4.2, grade: "A", demand: "High", competition: "Medium", margin: "$2-5K/mo", icon: "🦷" },
  { name: "Real Estate AI", score: 3.8, grade: "B", demand: "Very High", competition: "High", margin: "$1-3K/mo", icon: "🏠" },
  { name: "Insurance AI", score: 3.6, grade: "B", demand: "High", competition: "Medium", margin: "$1-4K/mo", icon: "🛡️" },
  { name: "HVAC AI", score: 3.5, grade: "B", demand: "Medium", competition: "Low", margin: "$1-2K/mo", icon: "❄️" },
  { name: "Legal AI", score: 3.4, grade: "C", demand: "High", competition: "High", margin: "$3-8K/mo", icon: "⚖️" },
  { name: "Fitness AI", score: 3.3, grade: "C", demand: "Medium", competition: "Very High", margin: "$500-2K/mo", icon: "💪" },
  { name: "Restaurant AI", score: 3.1, grade: "C", demand: "High", competition: "Medium", margin: "$500-1.5K/mo", icon: "🍽️" },
  { name: "Plumbing AI", score: 3.5, grade: "B", demand: "Medium", competition: "Low", margin: "$1-2K/mo", icon: "🔧" },
  { name: "Med Spa AI", score: 3.7, grade: "B", demand: "High", competition: "Medium", margin: "$2-5K/mo", icon: "✨" },
  { name: "Auto Repair AI", score: 3.2, grade: "C", demand: "Medium", competition: "Low", margin: "$800-2K/mo", icon: "🚗" },
  { name: "Roofing AI", score: 3.6, grade: "B", demand: "Medium", competition: "Low", margin: "$1-3K/mo", icon: "🏗️" },
  { name: "Chiropractor AI", score: 3.4, grade: "C", demand: "Medium", competition: "Medium", margin: "$1-3K/mo", icon: "🩺" },
];

const scoreColors: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-blue-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

export function TruthEnginePage() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? preScored.filter((n) =>
        n.name.toLowerCase().includes(query.toLowerCase()),
      )
    : preScored;

  return (
    <div className="p-6 space-y-6">
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
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => toast.info("Live research coming soon — this will trigger a full Truth Engine scan")}>
              <Zap className="size-4 mr-2" />
              Research
            </Button>
          </div>
        </CardContent>
      </Card>

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
              onClick={() => toast.info("Detailed niche report coming soon")}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
