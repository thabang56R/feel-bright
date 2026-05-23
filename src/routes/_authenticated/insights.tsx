import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHistory } from "@/lib/api";
import { Lightbulb, TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/insights")({ component: InsightsPage });

function InsightsPage() {
  const data = useMemo(() => getHistory(), []);

  const insights = useMemo(() => {
    const total = data.length || 1;
    const pos = data.filter((d) => d.sentiment === "positive").length;
    const neg = data.filter((d) => d.sentiment === "negative").length;
    const posRate = pos / total;
    const negRate = neg / total;

    // top keywords from negative reviews
    const negKeywords: Record<string, number> = {};
    data.filter((d) => d.sentiment === "negative").forEach((d) => {
      d.text.toLowerCase().match(/[a-z]{4,}/g)?.forEach((w) => {
        if (!["this", "that", "with", "they", "have", "from", "your", "very", "just", "been", "what", "when", "would", "could"].includes(w))
          negKeywords[w] = (negKeywords[w] ?? 0) + 1;
      });
    });
    const topNeg = Object.entries(negKeywords).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const recs: { icon: typeof Lightbulb; title: string; desc: string; tone: "success" | "warning" | "primary" }[] = [];
    if (posRate > 0.6) recs.push({ icon: TrendingUp, tone: "success", title: "Capitalize on positive momentum",
      desc: "Over 60% of feedback is positive — surface top reviews as testimonials and double down on what users love." });
    if (negRate > 0.2) recs.push({ icon: AlertTriangle, tone: "warning", title: "Address recurring complaints",
      desc: `Negative reviews mention: ${topNeg.slice(0, 3).map(([w]) => `"${w}"`).join(", ") || "various issues"}. Prioritize fixes this sprint.` });
    recs.push({ icon: Target, tone: "primary", title: "Refine product positioning",
      desc: "Aggregate themes from neutral reviews to identify unmet needs your messaging could clarify." });
    recs.push({ icon: Sparkles, tone: "primary", title: "Automate response workflows",
      desc: "Route negative feedback into a customer-success queue for sub-24h response and tracked resolution." });

    return { posRate, negRate, topNeg, recs };
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="mt-1 text-muted-foreground">Generated recommendations based on your sentiment patterns.</p>
      </div>

      <Card className="glass relative overflow-hidden border-primary/30">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-primary blur-3xl opacity-40" />
        <CardHeader className="relative">
          <Badge variant="secondary" className="w-fit bg-primary/15 text-primary">
            <Sparkles className="mr-1 h-3 w-3" /> AI summary
          </Badge>
          <CardTitle className="font-display text-2xl">
            Your audience is leaning <span className="text-gradient">{insights.posRate > 0.5 ? "positive" : insights.negRate > insights.posRate ? "negative" : "mixed"}</span>
          </CardTitle>
          <CardDescription className="text-base">
            {Math.round(insights.posRate * 100)}% positive, {Math.round(insights.negRate * 100)}% negative across {data.length} analyzed items.
            The model surfaces clear themes you can act on this week.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.recs.map((r) => {
          const toneClass = r.tone === "success" ? "from-success/30 to-success/0 text-success"
            : r.tone === "warning" ? "from-warning/30 to-warning/0 text-warning"
            : "from-primary/30 to-primary/0 text-primary";
          return (
            <Card key={r.title} className="glass border-border/60 transition hover:border-primary/40 hover:shadow-glow">
              <CardContent className="p-5">
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${toneClass}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Top negative themes</CardTitle>
          <CardDescription>Frequent words appearing in negative reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {insights.topNeg.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enough negative data yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {insights.topNeg.map(([word, count]) => (
                <Badge key={word} variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                  {word} <span className="ml-1.5 opacity-70">×{count}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
