"use client";
import { useState } from "react";
import type { NewWidgetConfig, LayoutType } from "./types";
import { Table, BarChart2, Square } from "lucide-react";

const PRESETS: { id: string; label: string; apiUrl: string; headers?: Record<string, string>; layout?: LayoutType }[] = [
  // 🟢 IndianAPI
  {
    id: "indianapi_bse_most_active",
    label: "IndianAPI · BSE Most Active",
    apiUrl: "https://stock.indianapi.in/BSE_most_active",
    headers: { "X-Api-Key": "" },
    layout: "table",
  },
  {
    id: "indianapi_top_gainers",
    label: "IndianAPI · Top Gainers",
    apiUrl: "https://stock.indianapi.in/top_gainers",
    headers: { "X-Api-Key": "" },
    layout: "table",
  },
  {
    id: "indianapi_top_losers",
    label: "IndianAPI · Top Losers",
    apiUrl: "https://stock.indianapi.in/top_losers",
    headers: { "X-Api-Key": "" },
    layout: "table",
  },
  {
    id: "indianapi_trending",
    label: "IndianAPI · Trending",
    apiUrl: "https://stock.indianapi.in/trending",
    headers: { "X-Api-Key": "" },
    layout: "table",
  },

  // 🟡 Finnhub
  {
    id: "finnhub_quote",
    label: "Finnhub · Quote",
    apiUrl: "https://finnhub.io/api/v1/quote",
    layout: "table",
  },
  {
    id: "finnhub_company_profile",
    label: "Finnhub · Company Profile",
    apiUrl: "https://finnhub.io/api/v1/stock/profile2",
    layout: "card",
  },
  {
    id: "finnhub_peers",
    label: "Finnhub · Company Peers",
    apiUrl: "https://finnhub.io/api/v1/stock/peers",
    layout: "table",
  },
  {
    id: "finnhub_recommendation_trends",
    label: "Finnhub · Recommendation Trends",
    apiUrl: "https://finnhub.io/api/v1/stock/recommendation",
    layout: "table",
  },

  {
    id: "alpha_fx",
    label: "Alpha Vantage · FX Daily",
    apiUrl: "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=FROM_CURRENCY&to_symbol=TO_CURRENCY&outputsize=compact_or_full&apikey=",
    layout: "json",
  },
  {
    id: "alpha_crypto",
    label: "Alpha Vantage · Crypto Daily",
    apiUrl: "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=",
    layout: "json",
  },
];


interface HeaderPair {
  id: string;
  key: string;
  value: string;
}

interface AddWidgetModalProps {
  onClose: () => void;
  onSave: (widget: NewWidgetConfig) => void;
}

export default function AddWidgetModal({ onClose, onSave }: AddWidgetModalProps) {
  const [presetId, setPresetId] = useState<string>("");
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [interval, setInterval] = useState<number>(30);
  const [layout, setLayout] = useState<LayoutType>("table");
  const [symbols, setSymbols] = useState("");
  const [headers, setHeaders] = useState<HeaderPair[]>([]);
  const [chartField, setChartField] = useState("4. close");

  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applyPreset = (id: string) => {
    setPresetId(id);
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setApiUrl(p.apiUrl || "");
    setLayout((p.layout as LayoutType) || "table");
    const pairs: HeaderPair[] = p.headers ? Object.entries(p.headers).map(([k, v], i) => ({ id: `${k}-${i}`, key: k, value: v })) : [];
    setHeaders(pairs);
  };

  const addHeaderRow = () => setHeaders((h) => [...h, { id: Date.now().toString(), key: "", value: "" }]);
  const removeHeaderRow = (id: string) => setHeaders((h) => h.filter((r) => r.id !== id));
  const updateHeaderRow = (id: string, key: string, value: string) =>
    setHeaders((h) => h.map((r) => (r.id === id ? { ...r, key, value } : r)));

  const buildHeadersObject = (): Record<string, string> | undefined => {
    const obj: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) obj[h.key.trim()] = h.value;
    }
    return Object.keys(obj).length ? obj : undefined;
  };

  const handleSave = () => {
    if (!apiUrl.trim()) {
      setError("API URL is required");
      return;
    }
    if (interval <= 0) {
      setError("Refresh interval must be > 0");
      return;
    }

    const symbolList = symbols.split(",").map((s) => s.trim()).filter(Boolean);
    const headersObj = buildHeadersObject();

    onSave({
      name: name.trim() || (presetId ? PRESETS.find((p) => p.id === presetId)?.label || "Untitled" : "Untitled Widget"),
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim() || undefined,
      interval,
      layout,
      symbols: symbolList.length ? symbolList : undefined,
      headers: headersObj,
      preset: presetId || undefined,
      chartField,
    });

    onClose();
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
  <div className="finboard-modal" onClick={stop} style={{ background: "var(--modal-bg, #fff)", color: "var(--modal-fg, #222)", padding: 20, borderRadius: 16, width: 600, maxWidth: "98vw", boxShadow: "0 4px 32px rgba(30,64,175,0.13)", transition: "background 0.3s, color 0.3s" }}>
        <style>{`
          .dark .finboard-modal {
            --modal-bg: #222831;
            --modal-fg: #e3eafc;
          }
          .finboard-modal {
            --modal-bg: #f9f9ff;
            --modal-fg: #222;
          }
          .finboard-modal input, .finboard-modal select {
            background: var(--modal-input-bg, #f3f6fd);
            color: var(--modal-fg, #222);
            border: 1px solid #dbeafe;
            border-radius: 8px;
            margin-bottom: 10px;
            padding: 8px;
            transition: background 0.3s, color 0.3s;
          }
          .dark .finboard-modal input, .dark .finboard-modal select {
            background: #222831;
            color: #e3eafc;
            border: 1px solid #334155;
          }
          .finboard-modal button {
            background: var(--btn-bg, #e0e7ff);
            color: var(--btn-fg, #393E46);
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            margin-right: 8px;
            font-weight: 500;
            box-shadow: 0 1px 4px rgba(30,64,175,0.07);
            transition: background 0.2s, color 0.2s;
            cursor: pointer;
          }
          .dark .finboard-modal button {
            background: #393E46;
            color: #ffffff;
          }
        `}</style>
        <h3 style={{ marginTop: 0 }}>Add Widget</h3>

        <label style={{ display: "block", marginBottom: 6 }}>Preset</label>
        <select value={presetId} onChange={(e) => applyPreset(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 12 }}>
          <option value="">— none —</option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: 6 }}>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: "block", marginBottom: 6 }}>API URL</label>
            <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} style={{ width: "100%", padding: 8 }} placeholder="https://example.com/api" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 6 }}>API Key</label>
            <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Interval (s)</label>
            <input type="number" min={1} value={interval} onChange={(e) => setInterval(Number(e.target.value))} style={{ width: "100%", padding: 8 }} />
          </div>
        </div>

        <label style={{ display: "block", marginBottom: 6 }}>Layout</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="radio" name="layout" value="table" checked={layout === "table"} onChange={() => setLayout("table")} />
            <Table size={16} /> Table
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="radio" name="layout" value="json" checked={layout === "json"} onChange={() => setLayout("json")} />
            <BarChart2 size={16} /> JSON / Chart
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="radio" name="layout" value="card" checked={layout === "card"} onChange={() => setLayout("card")} />
            <Square size={16} /> Card
          </label>
        </div>

        {layout === "table" && (
          <>
            <label style={{ display: "block", marginBottom: 6 }}>Symbols (comma-separated)</label>
            <input type="text" value={symbols} onChange={(e) => setSymbols(e.target.value)} placeholder="AAPL, MSFT, TCS" style={{ width: "100%", padding: 8, marginBottom: 10 }} />
          </>
        )}

        {layout === "json" && (
          <>
            <label style={{ display: "block", marginBottom: 6 }}>Chart Field</label>
            <input
              type="text"
              value={chartField}
              onChange={(e) => setChartField(e.target.value)}
              placeholder='e.g. "4. close" or "5. volume"'
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />
          </>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Custom Headers</label>
          {headers.map((h) => (
            <div key={h.id} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input type="text" placeholder="Header name" value={h.key} onChange={(e) => updateHeaderRow(h.id, e.target.value, h.value)} style={{ flex: "0 0 40%", padding: 6 }} />
              <input type="text" placeholder="Header value" value={h.value} onChange={(e) => updateHeaderRow(h.id, h.key, e.target.value)} style={{ flex: 1, padding: 6 }} />
              <button type="button" onClick={() => removeHeaderRow(h.id)} style={{ padding: 6 }}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addHeaderRow} style={{ padding: "6px 10px" }}>+ Add Header</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={handleSave} style={{ padding: "8px 12px" }}>Save</button>
          <button type="button" onClick={onClose} style={{ padding: "8px 12px" }}>Cancel</button>
        </div>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {testData && <pre style={{ maxHeight: 220, overflow: "auto", background: "#f5f5f5", padding: 8 }}>{JSON.stringify(testData, null, 2)}</pre>}
      </div>
    </div>
  );
}
