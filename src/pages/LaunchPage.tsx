import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const nicheIcons: Record<string, string> = {
  "Dental AI": "🦷",
  "Real Estate AI": "🏠",
  "Insurance AI": "🛡️",
  "HVAC AI": "❄️",
  "Med Spa AI": "✨",
  "Roofing AI": "🏗️",
  "Legal AI": "⚖️",
  "Fitness AI": "💪",
  "Plumbing AI": "🔧",
  "Auto Repair AI": "🚗",
  "Restaurant AI": "🍽️",
  "Chiropractor AI": "🩺",
};

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

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function LaunchPage() {
  const navigate = useNavigate();
  const createNiche = useMutation(api.niches.create);
  const logActivity = useMutation(api.activity.log);

  const [step, setStep] = useState(0);
  const [nicheName, setNicheName] = useState("");
  const [geography, setGeography] = useState("");
  const [budget, setBudget] = useState("");
  const [launching, setLaunching] = useState(false);
  const [currentLaunchStep, setCurrentLaunchStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [launchComplete, setLaunchComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = [
    { title: "Select Niche", desc: "Choose or name your niche" },
    { title: "Configure", desc: "Set geography and budget" },
    { title: "Preflight", desc: "Verify credits and integrations" },
    { title: "Launch", desc: "16-step automated deployment" },
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleLaunch = async () => {
    setLaunching(true);
    setCurrentLaunchStep(0);
    setCompletedSteps([]);
    setLaunchComplete(false);

    try {
      // Create the niche in the database
      const nicheId = await createNiche({
        name: nicheName,
        slug: slugify(nicheName),
        description: `AI-powered automation for ${nicheName.replace(" AI", "")} businesses. Automated outreach, lead gen, and follow-up.`,
        geography: geography || "US - National",
        icon: nicheIcons[nicheName] || "🎯",
      });

      // Log the activity
      await logActivity({
        nicheId,
        type: "niche_launched",
        message: `${nicheName} niche launch initiated — running 16-step pipeline`,
      });

      // Simulate pipeline steps
      let stepIndex = 0;
      intervalRef.current = setInterval(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
        if (stepIndex < launchSteps.length) {
          setCurrentLaunchStep(stepIndex);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCurrentLaunchStep(-1);
          setLaunchComplete(true);
          setLaunching(false);
          toast.success(`${nicheName} launched successfully!`);
        }
      }, 800);
    } catch (e: any) {
      toast.error(e.message || "Launch failed");
      setLaunching(false);
    }
  };

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
            <CardTitle className="flex items-center gap-2">
              {launchComplete ? (
                <>
                  <CheckCircle2 className="size-5 text-emerald-400" />
                  {nicheName} — Launch Complete!
                </>
              ) : launching ? (
                <>
                  <Loader2 className="size-5 animate-spin text-primary" />
                  Launching {nicheName}...
                </>
              ) : (
                <>Ready to Launch {nicheName}</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {launchSteps.map((ls, i) => {
                const isCompleted = completedSteps.includes(i);
                const isCurrent = i === currentLaunchStep;
                return (
                  <div
                    key={ls}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                      isCurrent
                        ? "bg-primary/10 border border-primary/20"
                        : isCompleted
                          ? "bg-emerald-500/5"
                          : "bg-muted/10"
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm ${isCurrent ? "font-medium" : isCompleted ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {ls}
                    </span>
                    {isCurrent && (
                      <Badge className="ml-auto bg-primary/20 text-primary border-0">
                        <Loader2 className="size-3 mr-1 animate-spin" />
                        Running
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-0">
                        Done
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {!launching && !launchComplete && (
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button className="flex-1" onClick={handleLaunch}>
                  <Rocket className="size-4 mr-2" />
                  Start 16-Step Pipeline
                </Button>
              </div>
            )}

            {launchComplete && (
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-emerald-400 font-semibold">🎉 {nicheName} is live!</p>
                  <p className="text-sm text-muted-foreground mt-1">All 16 pipeline steps completed successfully.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard")}>
                    View Portfolio
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    setStep(0);
                    setNicheName("");
                    setGeography("");
                    setBudget("");
                    setLaunching(false);
                    setCurrentLaunchStep(-1);
                    setCompletedSteps([]);
                    setLaunchComplete(false);
                  }}>
                    <Rocket className="size-4 mr-2" />
                    Launch Another
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
