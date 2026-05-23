import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeText, saveResult, type AnalysisResult } from "@/lib/api";
import { Sparkles, Loader2, Upload, FileText, ThumbsUp, ThumbsDown, Minus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analyze")({ component: AnalyzePage });

function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [csvRows, setCsvRows] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) { toast.error("Please enter some text"); return; }
    setLoading(true);
    try {
      const r = await analyzeText(text);
      saveResult(r);
      setResults((p) => [r, ...p]);
      setText("");
      toast.success("Analysis complete");
    } catch { toast.error("Analysis failed"); }
    finally { setLoading(false); }
  };

  const handleCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    // strip header if it looks like one
    const rows = lines[0]?.toLowerCase().includes("text") ? lines.slice(1) : lines;
    const clean = rows.map((r) => r.replace(/^"|"$/g, "").replace(/^[^,]*,/, "")).filter(Boolean).slice(0, 50);
    setCsvRows(clean);
    toast.success(`Loaded ${clean.length} rows`);
  };

  const processCSV = async () => {
    if (csvRows.length === 0) return;
    setLoading(true);
    const out: AnalysisResult[] = [];
    for (const row of csvRows) {
      const r = await analyzeText(row, "csv");
      saveResult(r);
      out.push(r);
      setResults((p) => [r, ...p]);
    }
    setLoading(false);
    setCsvRows([]);
    toast.success(`Processed ${out.length} reviews`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analyze Reviews</h1>
        <p className="mt-1 text-muted-foreground">Paste text or upload a CSV to get instant AI sentiment.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Single analysis</CardTitle>
            <CardDescription>Type or paste a review, tweet, or feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. The new dashboard is amazing — fast, intuitive, and beautiful!"
              rows={6}
              className="resize-none bg-card/40"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{text.length} chars</p>
              <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><Upload className="h-5 w-5 text-secondary" /> Bulk CSV upload</CardTitle>
            <CardDescription>One review per line or "id,text" format</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              hidden
              onChange={(e) => e.target.files?.[0] && handleCSV(e.target.files[0])}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-card/30 transition hover:border-primary/60 hover:bg-card/50"
            >
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Click to upload CSV</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Max 50 rows per batch</p>
            </div>
            {csvRows.length > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm">
                <span>{csvRows.length} rows ready</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setCsvRows([])}><X className="h-4 w-4" /></Button>
                  <Button size="sm" onClick={processCSV} disabled={loading} className="bg-gradient-primary text-primary-foreground">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Process"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Results</h2>
          {results.map((r) => <ResultCard key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}

function ResultCard({ r }: { r: AnalysisResult }) {
  const Icon = r.sentiment === "positive" ? ThumbsUp : r.sentiment === "negative" ? ThumbsDown : Minus;
  const color = r.sentiment === "positive" ? "text-success" : r.sentiment === "negative" ? "text-destructive" : "text-muted-foreground";
  const bg = r.sentiment === "positive" ? "bg-success/10 border-success/30" : r.sentiment === "negative" ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border/60";

  return (
    <Card className={`glass border ${bg}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`capitalize ${color} border-current`}>{r.sentiment}</Badge>
              <Badge variant="secondary" className="text-xs">{Math.round(r.confidence * 100)}% confidence</Badge>
              {r.keywords.map((k) => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}
            </div>
            <p className="mt-2 text-sm">{r.text}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <ScoreBar label="Positive" value={r.scores.positive} color="oklch(0.72 0.18 155)" />
              <ScoreBar label="Neutral" value={r.scores.neutral} color="oklch(0.72 0.03 270)" />
              <ScoreBar label="Negative" value={r.scores.negative} color="oklch(0.65 0.22 25)" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{Math.round(value * 100)}%</span></div>
      <Progress value={value * 100} className="h-1.5" style={{ ["--progress-color" as never]: color } as never} />
    </div>
  );
}
