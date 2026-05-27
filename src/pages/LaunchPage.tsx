import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Globe,
  DollarSign,
  Shield,
} from "lucide-react";


const launchSteps = [
  "Niche Evaluation",
  "Market Research",
  "Competitor Analysis",
  "Offer Engineering",
  "Brand & Identity",
  "Landing Page Build",
  "CRM Setup",
  "Email Sequences",
  "Ad Creative",
  "Meta Campaign",
  "Google Campaign",
  "Content Calendar",
  "Voice AI Config",
  "Integration Wiring",
  "Preflight Check",
  "Go Live & Verify",
];

export function LaunchPage() {
  const [step, setStep] = useState(0);
  const [nicheName, setNicheName] = useState("");
  const [geography, setGeography] = useState("");
  const [budget, setBudget] = useState("");

  const steps = [
    { title: "Select Niche", desc: "Choose or name your niche" },
    { title: "Configure", desc: "Set geography and budget" },
    { title: "Preflight", desc: "Verify credits and integrations" },
    { title: "Launch", desc: "16-step automated deployment" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Launch New Niche</h1>
        <p className="text-sm text-muted-foreground">
          16-step automated pipeline from evaluation to live business.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <Circle className="size-3.5" />
              )}
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <Card className="bg-card max-w-xl">
          <CardHeader>
            <CardTitle>Select Your Niche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Niche Name</Label>
              <Input
                placeholder="e.g., Dental AI, Real Estate AI, HVAC AI..."
                value={nicheName}
                onChange={(e) => setNicheName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Popular niches</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Dental AI", "Real Estate AI", "Insurance AI", "HVAC AI", "Med Spa AI", "Roofing AI"].map(
                  (n) => (
                    <Badge
                      key={n}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all"
                      onClick={() => setNicheName(n)}
                    >
                      {n}
                    </Badge>
                  ),
                )}
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!nicheName}
              onClick={() => setStep(1)}
            >
              Continue
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="bg-card max-w-xl">
          <CardHeader>
            <CardTitle>Configure {nicheName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Geography</Label>
              <Input
                placeholder="e.g., US National, US - FL, TX, CA..."
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Monthly Ad Budget</Label>
              <Input
                placeholder="e.g., $500, $1000, $5000..."
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(2)}>
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-card max-w-xl">
          <CardHeader>
            <CardTitle>Preflight Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { icon: Zap, label: "Credit Balance", status: "49,200 credits", ok: true },
                { icon: Globe, label: "Firecrawl", status: "Connected", ok: true },
                { icon: Globe, label: "Apify", status: "Connected", ok: true },
                { icon: DollarSign, label: "Stripe", status: "Connected", ok: true },
                { icon: Shield, label: "Supabase", status: "Connected", ok: true },
              ].map((check) => (
                <div key={check.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <check.icon className="size-4 text-muted-foreground" />
                    <span className="text-sm">{check.label}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      check.ok
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }
                  >
                    {check.ok ? "✓" : "✗"} {check.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm">
                <strong>{nicheName}</strong> • {geography || "US National"} • {budget || "$1,000"}/mo budget
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                <Rocket className="size-4 mr-2" />
                Launch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-card max-w-2xl">
          <CardHeader>
            <CardTitle>Launching {nicheName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {launchSteps.map((ls, i) => (
                <div
                  key={ls}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                    i === 0
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/10"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-sm ${i === 0 ? "font-medium" : "text-muted-foreground"}`}>
                    {ls}
                  </span>
                  {i === 0 && (
                    <Badge className="ml-auto bg-primary/20 text-primary border-0">
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Live launch pipeline coming soon. Currently processes via Slack commands.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
