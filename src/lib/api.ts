// API-ready architecture. Swap BASE_URL + uncomment axios calls when backend lands.
// import axios from "axios";
// export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "/api" });

export type Sentiment = "positive" | "negative" | "neutral";

export interface AnalysisResult {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number; // 0-1
  scores: { positive: number; negative: number; neutral: number };
  keywords: string[];
  createdAt: string;
  source?: string;
}

const POS = ["love", "great", "amazing", "excellent", "best", "wonderful", "fantastic", "good", "happy", "perfect", "awesome", "delight", "smooth", "fast", "recommend"];
const NEG = ["hate", "terrible", "awful", "bad", "worst", "slow", "broken", "horrible", "poor", "bug", "crash", "disappoint", "useless", "angry", "refund"];

export async function analyzeText(text: string, source = "manual"): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 900));
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z']+/g) ?? [];
  let pos = 0, neg = 0;
  const hits: string[] = [];
  for (const w of words) {
    if (POS.includes(w)) { pos++; hits.push(w); }
    if (NEG.includes(w)) { neg++; hits.push(w); }
  }
  const total = pos + neg;
  let sentiment: Sentiment = "neutral";
  let positive = 0.33, negative = 0.33, neutral = 0.34;
  if (total === 0) {
    neutral = 0.7; positive = 0.18; negative = 0.12;
  } else {
    positive = pos / total * 0.85 + 0.05;
    negative = neg / total * 0.85 + 0.05;
    neutral = Math.max(0, 1 - positive - negative);
    sentiment = pos > neg ? "positive" : neg > pos ? "negative" : "neutral";
  }
  const confidence = Math.min(0.99, 0.55 + total * 0.08 + Math.random() * 0.1);
  return {
    id: crypto.randomUUID(),
    text,
    sentiment,
    confidence,
    scores: { positive, negative, neutral },
    keywords: Array.from(new Set(hits)).slice(0, 8),
    createdAt: new Date().toISOString(),
    source,
  };
}

const HISTORY_KEY = "sentio.history";

export function getHistory(): AnalysisResult[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}
export function saveResult(r: AnalysisResult) {
  const list = [r, ...getHistory()].slice(0, 500);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
export function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

export function seedDemoIfEmpty() {
  if (getHistory().length > 0) return;
  const samples: { text: string; source: string }[] = [
    { text: "Absolutely love the new dashboard, it's amazing and fast!", source: "twitter" },
    { text: "The app keeps crashing on launch, terrible experience.", source: "appstore" },
    { text: "It's okay, nothing special but does the job.", source: "review" },
    { text: "Best customer service I've had, wonderful team.", source: "email" },
    { text: "Slow loading times and confusing UI, very disappointed.", source: "appstore" },
    { text: "Perfect for my workflow, highly recommend!", source: "twitter" },
    { text: "Average product, could be better.", source: "review" },
    { text: "Fantastic update, smooth and intuitive.", source: "review" },
    { text: "Awful bug ruined my work, please fix.", source: "email" },
    { text: "Good value for money overall.", source: "review" },
    { text: "Horrible customer support, useless responses.", source: "email" },
    { text: "Amazing AI features, a real delight to use.", source: "twitter" },
  ];
  const now = Date.now();
  const seeded = samples.map((s, i) => {
    const lower = s.text.toLowerCase();
    let pos = 0, neg = 0;
    for (const w of lower.match(/[a-z']+/g) ?? []) {
      if (POS.includes(w)) pos++;
      if (NEG.includes(w)) neg++;
    }
    const total = pos + neg || 1;
    const positive = pos ? pos / total * 0.85 + 0.05 : 0.18;
    const negative = neg ? neg / total * 0.85 + 0.05 : 0.12;
    const neutral = Math.max(0, 1 - positive - negative);
    const sentiment: Sentiment = pos > neg ? "positive" : neg > pos ? "negative" : "neutral";
    return {
      id: crypto.randomUUID(),
      text: s.text,
      sentiment,
      confidence: 0.7 + Math.random() * 0.25,
      scores: { positive, negative, neutral },
      keywords: [],
      createdAt: new Date(now - i * 3600_000 * (1 + Math.random() * 6)).toISOString(),
      source: s.source,
    } satisfies AnalysisResult;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(seeded));
}

export function exportCSV(rows: AnalysisResult[]) {
  const headers = ["id", "createdAt", "sentiment", "confidence", "source", "text"];
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      [r.id, r.createdAt, r.sentiment, r.confidence.toFixed(3), r.source ?? "", `"${r.text.replace(/"/g, '""')}"`].join(",")
    ),
  ].join("\n");
  download(csv, "sentio-export.csv", "text/csv");
}

export function exportPDF(rows: AnalysisResult[]) {
  // Lightweight printable HTML → user prints to PDF
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>Sentio Report</title>
    <style>body{font-family:Inter,system-ui;padding:32px;color:#111}h1{margin:0 0 8px}
    table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}
    th,td{border-bottom:1px solid #eee;padding:8px;text-align:left;vertical-align:top}
    .pos{color:#15803d}.neg{color:#b91c1c}.neu{color:#6b7280}</style></head><body>
    <h1>Sentio Analytics Report</h1><p>Generated ${new Date().toLocaleString()}</p>
    <table><thead><tr><th>Date</th><th>Sentiment</th><th>Conf.</th><th>Source</th><th>Text</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td>${new Date(r.createdAt).toLocaleString()}</td>
      <td class="${r.sentiment === 'positive' ? 'pos' : r.sentiment === 'negative' ? 'neg' : 'neu'}">${r.sentiment}</td>
      <td>${(r.confidence * 100).toFixed(1)}%</td><td>${r.source ?? ''}</td><td>${escapeHtml(r.text)}</td></tr>`).join("")}
    </tbody></table></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 300);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
