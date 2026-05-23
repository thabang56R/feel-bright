import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, ThumbsUp, ThumbsDown, Activity, Sparkles, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useMemo } from "react";
import { getHistory } from "@/lib/api";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getHistory(), []);

  const stats = useMemo(() => {
    const total = data.length;
    const pos = data.filter((d) => d.sentiment === "positive").length;
    const neg = data.filter((d) => d.sentiment === "negative").length;
    const neu = data.filter((d) => d.sentiment === "neutral").length;
    const avgConf = total ? data.reduce((a, b) => a + b.confidence, 0) / total : 0;
    return { total, pos, neg, neu, avgConf };
  }, [data]);

  const trend = useMemo(() => {
    const days: Record<string, { day: string; positive: number; negative: number; neutral: number }> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const k = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[k] = { day: k, positive: 0, negative: 0, neutral: 0 };
    }
    data.forEach((r) => {
      const d = new Date(r.createdAt);
      const k = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (days[k]) days[k][r.sentiment]++;
    });
    return Object.values(days);
  }, [data]);

  const pieData = [
    { name: "Positive", value: stats.pos, color: "oklch(0.72 0.18 155)" },
    { name: "Negative", value: stats.neg, color: "oklch(0.65 0.22 25)" },
    { name: "Neutral", value: stats.neu, color: "oklch(0.72 0.03 270)" },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name?.split(" ")[0]} 👋</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Sentiment Dashboard</h1>
        </div>
        <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Link to="/analyze"><Sparkles className="mr-2 h-4 w-4" /> Analyze new text</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total reviews" value={stats.total.toLocaleString()} delta={12} icon={MessageSquare} accent="primary" />
        <StatCard label="Positive" value={`${stats.total ? Math.round(stats.pos / stats.total * 100) : 0}%`} delta={4} icon={ThumbsUp} accent="success" />
        <StatCard label="Negative" value={`${stats.total ? Math.round(stats.neg / stats.total * 100) : 0}%`} delta={-2} icon={ThumbsDown} accent="accent" />
        <StatCard label="Avg. confidence" value={`${Math.round(stats.avgConf * 100)}%`} delta={3} icon={Activity} accent="secondary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Sentiment trend</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">Live</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="cP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 155)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 155)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cN" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="positive" stroke="oklch(0.72 0.18 155)" fill="url(#cP)" strokeWidth={2} />
                <Area type="monotone" dataKey="negative" stroke="oklch(0.65 0.22 25)" fill="url(#cN)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Distribution</CardTitle>
            <CardDescription>All-time breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent analyses</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/40 p-3 transition hover:border-primary/30">
              <Badge className={
                r.sentiment === "positive" ? "bg-success/15 text-success border-success/30" :
                r.sentiment === "negative" ? "bg-destructive/15 text-destructive border-destructive/30" :
                "bg-muted text-muted-foreground"
              } variant="outline">{r.sentiment}</Badge>
              <p className="min-w-0 flex-1 truncate text-sm">{r.text}</p>
              <span className="text-xs text-muted-foreground">{Math.round(r.confidence * 100)}%</span>
            </div>
          ))}
          {data.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No analyses yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
