import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Clock, Zap, Play, Pause, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-muted text-muted-foreground border-border",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function timeUntil(ts: string) {
  const diff = new Date(ts).getTime() - Date.now();
  if (diff < 0) return "Overdue";
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return `${Math.floor(diff / 60000)}m`;
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function AgentCard({ agent }: { agent: any }) {
  const toggleStatus = useMutation(api.agents.toggleStatus);
  const removeAgent = useMutation(api.agents.remove);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = async () => {
    try {
      await toggleStatus({ id: agent._id });
      toast.success(`${agent.name} ${agent.status === "active" ? "paused" : "activated"}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await removeAgent({ id: agent._id });
      toast.success(`${agent.name} removed`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Card className="bg-card border-border hover:border-primary/20 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{agent.icon || "🤖"}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{agent.name}</h3>
                <Badge variant="outline" className={statusColors[agent.status]}>
                  {agent.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggle}>
              {agent.status === "active" ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
            {confirmDelete ? (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
                  Yes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  No
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {agent.description}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-2.5 rounded bg-muted/20">
            <p className="text-xs text-muted-foreground">Runs</p>
            <p className="text-sm font-semibold">{agent.runsTotal}</p>
          </div>
          <div className="p-2.5 rounded bg-muted/20">
            <p className="text-xs text-muted-foreground">Credits</p>
            <p className="text-sm font-semibold">{(agent.creditsUsed / 1000).toFixed(1)}K</p>
          </div>
          <div className="p-2.5 rounded bg-muted/20">
            <p className="text-xs text-muted-foreground">Schedule</p>
            <p className="text-sm font-semibold truncate">{agent.schedule}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            Last: {agent.lastRunAt ? timeAgo(agent.lastRunAt) : "Never"}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="size-3" />
            Next: {agent.nextRunAt ? timeUntil(agent.nextRunAt) : "—"}
          </span>
        </div>

        {agent.lastOutput && (
          <div className="mt-3 p-2.5 rounded bg-muted/10 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono">{agent.lastOutput}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateAgentDialog({ onClose }: { onClose: () => void }) {
  const createAgent = useMutation(api.agents.create);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [icon, setIcon] = useState("🤖");

  const handleSubmit = async () => {
    if (!name || !code || !description || !schedule) {
      toast.error("All fields are required");
      return;
    }
    try {
      await createAgent({ name, code: code.toUpperCase(), description, schedule, icon });
      toast.success(`Agent ${name} created`);
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="bg-card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create Agent</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div>
              <Label>Icon</Label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="mt-1 text-center text-xl" maxLength={2} />
            </div>
            <div>
              <Label>Name</Label>
              <Input placeholder="e.g., Watchdog" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Code</Label>
            <Input placeholder="e.g., WATCHDOG" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 font-mono uppercase" />
          </div>
          <div>
            <Label>Description</Label>
            <Input placeholder="What does this agent do?" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Schedule</Label>
            <Input placeholder="e.g., Daily 9:00 AM, Weekly, On-demand" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="mt-1" />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={!name || !code || !description || !schedule}>
            <Plus className="size-4 mr-2" />
            Create Agent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AgentsPage() {
  const agents = useQuery(api.agents.list);
  const [showCreate, setShowCreate] = useState(false);

  const activeCount = agents?.filter((a: any) => a.status === "active").length ?? 0;
  const totalCredits = agents?.reduce((s: number, a: any) => s + a.creditsUsed, 0) ?? 0;
  const totalRuns = agents?.reduce((s: number, a: any) => s + a.runsTotal, 0) ?? 0;

  return (
    <div className="p-6 space-y-6">
      {showCreate && <CreateAgentDialog onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} active • {totalRuns} total runs • {(totalCredits / 1000).toFixed(1)}K credits used
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowCreate(true)}>
          <Bot className="size-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Agent Grid */}
      {agents && agents.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent: any) => (
            <AgentCard key={agent._id} agent={agent} />
          ))}
        </div>
      ) : (
        <Card className="bg-card">
          <CardContent className="py-12 text-center">
            <Bot className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No agents configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Launch a niche to activate the agent workforce, or create a custom agent.
            </p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="size-4 mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
