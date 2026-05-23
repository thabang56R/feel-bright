import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "accent" | "success";
}

const accentMap = {
  primary: "from-primary/30 to-primary/5 text-primary",
  secondary: "from-secondary/30 to-secondary/5 text-secondary",
  accent: "from-accent/30 to-accent/5 text-accent",
  success: "from-success/30 to-success/5 text-success",
};

export function StatCard({ label, value, delta, icon: Icon, accent = "primary" }: Props) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="glass relative overflow-hidden border-border/60 transition hover:border-primary/40 hover:shadow-glow">
      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60", accentMap[accent])} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {delta !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
