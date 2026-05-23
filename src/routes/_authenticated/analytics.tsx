import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHistory, exportCSV, exportPDF } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { Download, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const data = useMemo(() => getHistory(), []);

  const pie = useMemo(() => {
    const p = data.filter((d) => d.sentiment === "positive").length;
    const n = data.filter((d) => d.sentiment === "negative").length;
    const u = data.filter((d) => d.sentiment === "neutral").length;
    return [
      { name: "Positive", value: p, color: "oklch(0.72 0.18 155)" },
      { name: "Negative", value: n, color: "oklch(0.65 0.22 25)" },
      { name: "Neutral", value: u, color: "oklch(0.72 0.03 270)" },
    ];
  }, [data]);

  const bySource = useMemo(() => {
    const map: Record<string, { source: string; positive: number; negative: number; neutral: number }> = {};
    data.forEach((d) => {
      const s = d.source ?? "other";
      map[s] ??= { source: s, positive: 0, negative: 0, neutral: 0 };
      map[s][d.sentiment]++;
    });
    return Object.values(map);
  }, [data]);

  const confTrend = useMemo(() => {
    const sorted = [...data].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    const buckets: Record<string, { day: string; confidence: number; count: number }> = {};
    sorted.forEach((d) => {
      const k = new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      buckets[k] ??= { day: k, confidence: 0, count: 0 };
      buckets[k].confidence += d.confidence;
      buckets[k].count++;
    });
    return Object.values(buckets).map((b) => ({ day: b.day, confidence: +(b.confidence / b.count * 100).toFixed(1) }));
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Deep visual breakdowns of your sentiment data.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportCSV(data)} variant="outline"><FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button onClick={() => exportPDF(data)} className="bg-gradient-primary text-primary-foreground shadow-glow"><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Sentiment distribution</CardTitle>
            <CardDescription>Share of all analyses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={4}>
                  {pie.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Confidence trend</CardTitle>
            <CardDescription>Average model confidence per day</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confTrend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="confidence" stroke="oklch(0.7 0.22 295)" strokeWidth={3} dot={{ fill: "oklch(0.78 0.16 210)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Sentiment by source</CardTitle>
          <CardDescription>Where positive and negative feedback comes from</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bySource}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="source" stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 12 }} />
              <YAxis stroke="oklch(0.72 0.03 270)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill="oklch(0.72 0.18 155)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="neutral" stackId="a" fill="oklch(0.72 0.03 270)" />
              <Bar dataKey="negative" stackId="a" fill="oklch(0.65 0.22 25)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
