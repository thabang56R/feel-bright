import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Sparkles, BarChart3, Lightbulb, Shield, Zap, ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Sentio AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/register">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 text-center">
        <Badge variant="secondary" className="mb-6 border-primary/30 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" /> Powered by transformer models
        </Badge>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Understand <span className="text-gradient">every voice</span><br />
          behind your brand.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Sentio AI turns reviews, tweets, and feedback into clear sentiment signals, trends,
          and AI-generated recommendations — in real time.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/register">Start free trial <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass">
            <Link to="/login">Live demo</Link>
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <Star className="h-4 w-4 fill-warning text-warning" />
          <Star className="h-4 w-4 fill-warning text-warning" />
          <Star className="h-4 w-4 fill-warning text-warning" />
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="ml-2">Trusted by 2,400+ product teams</span>
        </div>

        {/* Mock dashboard preview */}
        <div className="relative mx-auto mt-16 max-w-5xl animate-float">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-primary opacity-30 blur-3xl" />
          <div className="glass-strong overflow-hidden rounded-2xl border-border/60 shadow-elegant">
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">sentio.ai / dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              {[
                { label: "Reviews", v: "12,483", c: "from-primary/40 to-primary/0" },
                { label: "Positive", v: "68%", c: "from-success/40 to-success/0" },
                { label: "Negative", v: "14%", c: "from-destructive/40 to-destructive/0" },
                { label: "Sources", v: "23", c: "from-secondary/40 to-secondary/0" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.c} p-4 text-left`}>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 pb-6">
              <div className="col-span-2 h-44 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent p-4">
                <p className="text-xs text-muted-foreground">Sentiment trend (30 days)</p>
                <svg viewBox="0 0 300 100" className="mt-2 h-32 w-full">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.7 0.22 295)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="oklch(0.7 0.22 295)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C40,50 60,80 90,55 C120,30 150,60 180,40 C210,20 240,45 300,25 L300,100 L0,100 Z" fill="url(#g1)" />
                  <path d="M0,70 C40,50 60,80 90,55 C120,30 150,60 180,40 C210,20 240,45 300,25" fill="none" stroke="oklch(0.78 0.16 210)" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-transparent">
                <div className="relative h-32 w-32 rounded-full" style={{ background: "conic-gradient(oklch(0.72 0.18 155) 0 68%, oklch(0.65 0.22 25) 68% 82%, oklch(0.72 0.03 270) 82% 100%)" }}>
                  <div className="absolute inset-3 rounded-full bg-card" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight">Everything you need to listen at scale</h2>
          <p className="mt-3 text-muted-foreground">A complete toolkit, from raw text to executive-ready insight.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { i: Sparkles, t: "Real-time AI scoring", d: "Transformer-grade sentiment with confidence and keyword extraction.", c: "primary" },
            { i: BarChart3, t: "Beautiful analytics", d: "Pie, trend, and bar charts that update live as data arrives.", c: "secondary" },
            { i: Lightbulb, t: "Actionable insights", d: "AI summarizes drivers of churn, delight, and opportunity.", c: "accent" },
            { i: Zap, t: "CSV & API ingestion", d: "Drop in thousands of reviews or stream via REST/webhooks.", c: "primary" },
            { i: Shield, t: "Enterprise security", d: "JWT auth, RBAC, audit logs, SOC 2 ready architecture.", c: "secondary" },
            { i: Brain, t: "Multilingual models", d: "Analyze 40+ languages with consistent quality.", c: "accent" },
          ].map((f) => (
            <div key={f.t} className="glass group rounded-2xl p-6 transition hover:border-primary/40 hover:shadow-glow">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow`}>
                <f.i className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight">Simple, scalable pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade as your data grows.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Starter", price: "$0", desc: "For solo builders", features: ["1,000 analyses / mo", "Basic analytics", "CSV import"], cta: "Start free" },
            { name: "Pro", price: "$49", desc: "For growing teams", features: ["50,000 analyses / mo", "AI insights", "API access", "Priority support"], cta: "Start trial", popular: true },
            { name: "Enterprise", price: "Custom", desc: "For scale", features: ["Unlimited volume", "SSO + RBAC", "Dedicated cluster", "SLA & audit logs"], cta: "Contact sales" },
          ].map((p) => (
            <div key={p.name} className={`glass relative rounded-2xl p-7 ${p.popular ? "border-primary/60 shadow-glow" : ""}`}>
              {p.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground">Most popular</Badge>}
              <p className="text-sm text-muted-foreground">{p.name}</p>
              <p className="mt-2 font-display text-4xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {f}</li>
                ))}
              </ul>
              <Button asChild className={`mt-6 w-full ${p.popular ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`} variant={p.popular ? "default" : "outline"}>
                <Link to="/register">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sentio AI · Crafted for product teams who listen.
      </footer>
    </div>
  );
}
