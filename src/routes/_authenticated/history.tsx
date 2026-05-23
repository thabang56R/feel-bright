import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHistory, exportCSV, exportPDF, clearHistory, type Sentiment } from "@/lib/api";
import { Search, Download, FileSpreadsheet, Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({ component: HistoryPage });

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Sentiment | "all">("all");
  const [version, setVersion] = useState(0);

  const all = useMemo(() => getHistory(), [version]);
  const data = useMemo(() => {
    return all.filter((r) => {
      if (filter !== "all" && r.sentiment !== filter) return false;
      if (query && !r.text.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [all, filter, query]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Review History</h1>
          <p className="mt-1 text-muted-foreground">All analyzed reviews — searchable and exportable.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportCSV(data)} variant="outline"><FileSpreadsheet className="mr-2 h-4 w-4" /> CSV</Button>
          <Button onClick={() => exportPDF(data)} variant="outline"><Download className="mr-2 h-4 w-4" /> PDF</Button>
          <Button variant="ghost" className="text-destructive" onClick={() => { clearHistory(); setVersion((v) => v + 1); toast.success("Cleared"); }}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      <Card className="glass border-border/60">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-display">{data.length} reviews</CardTitle>
          <div className="flex flex-1 gap-2 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search text…" className="pl-9 bg-card/40" />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as Sentiment | "all")}>
              <SelectTrigger className="w-36 bg-card/40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No matching reviews.</div>
          )}
          {data.map((r) => (
            <div key={r.id} className="grid grid-cols-12 items-start gap-3 rounded-xl border border-border/40 bg-card/40 p-3 transition hover:border-primary/30">
              <div className="col-span-2 md:col-span-1">
                <Badge variant="outline" className={
                  r.sentiment === "positive" ? "border-success/40 bg-success/15 text-success" :
                  r.sentiment === "negative" ? "border-destructive/40 bg-destructive/15 text-destructive" :
                  "border-border bg-muted text-muted-foreground"
                }>{r.sentiment[0].toUpperCase()}</Badge>
              </div>
              <p className="col-span-10 text-sm md:col-span-7">{r.text}</p>
              <div className="col-span-6 text-xs text-muted-foreground md:col-span-2">{new Date(r.createdAt).toLocaleString()}</div>
              <div className="col-span-3 text-xs text-muted-foreground md:col-span-1">{r.source}</div>
              <div className="col-span-3 text-right text-xs font-medium md:col-span-1">{Math.round(r.confidence * 100)}%</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
