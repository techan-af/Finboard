"use client";
import { useState } from "react";
import type { NewWidgetConfig, WidgetConfig, LayoutType } from "./types";
import { Table, BarChart2, Square } from "lucide-react";

interface HeaderPair {
  id: string;
  key: string;
  value: string;
}

interface EditWidgetModalProps {
  widget: WidgetConfig;
  onClose: () => void;
  onSave: (widget: NewWidgetConfig) => void;
}

export default function EditWidgetModal({ widget, onClose, onSave }: EditWidgetModalProps) {
  const [name, setName] = useState(widget.name);
  const [apiUrl, setApiUrl] = useState(widget.apiUrl);
  const [apiKey, setApiKey] = useState(widget.apiKey || "");
  const [interval, setInterval] = useState<number>(widget.interval);
  const [layout, setLayout] = useState<LayoutType>(widget.layout);
  const [symbolsStr, setSymbolsStr] = useState((widget.symbols || []).join(", "));
  const [chartField, setChartField] = useState(widget.chartField || "4. close");

  const initialHeaders: HeaderPair[] = widget.headers ? Object.entries(widget.headers).map(([k, v], i) => ({ id: `${k}-${i}`, key: k, value: v })) : [];
  const [headers, setHeaders] = useState<HeaderPair[]>(initialHeaders);

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

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const handleSave = () => {
    const symbolList = symbolsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const headersObj = buildHeadersObject();

    onSave({
      name: name.trim() || "Untitled Widget",
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim() || undefined,
      interval,
      layout,
      symbols: symbolList.length ? symbolList : undefined,
      headers: headersObj,
      chartField,
    });
    onClose();
  };

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
            background: #393E46;
            color: #e3eafc;
            border: 1px solid #334155;
          }
          .finboard-modal button {
            background: var(--btn-bg, #e0e7ff);
            color: var(--btn-fg, #2563eb);
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
        <h3 style={{ marginTop: 0 }}>Edit Widget</h3>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 2 }}>
            <label>API URL</label>
            <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>API Key</label>
            <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Interval (s)</label>
            <input type="number" value={interval} onChange={(e) => setInterval(Number(e.target.value))} style={{ width: "100%", padding: 8 }} />
          </div>
        </div>

        <label>Layout</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <label><input type="radio" value="table" checked={layout === "table"} onChange={() => setLayout("table")} /> <Table size={16}/> Table</label>
          <label><input type="radio" value="json" checked={layout === "json"} onChange={() => setLayout("json")} /> <BarChart2 size={16}/> JSON</label>
          <label><input type="radio" value="card" checked={layout === "card"} onChange={() => setLayout("card")} /> <Square size={16}/> Card</label>
        </div>

        {layout === "table" && (
          <>
            <label>Symbols</label>
            <input type="text" value={symbolsStr} onChange={(e) => setSymbolsStr(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
          </>
        )}

        {layout === "json" && (
          <>
            <label>Chart Field</label>
            <input type="text" value={chartField} onChange={(e) => setChartField(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
          </>
        )}

        <label>Custom Headers</label>
        {headers.map((h) => (
          <div key={h.id} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input type="text" value={h.key} onChange={(e) => updateHeaderRow(h.id, e.target.value, h.value)} placeholder="Header" style={{ flex: "0 0 40%", padding: 6 }} />
            <input type="text" value={h.value} onChange={(e) => updateHeaderRow(h.id, h.key, e.target.value)} placeholder="Value" style={{ flex: 1, padding: 6 }} />
            <button type="button" onClick={() => removeHeaderRow(h.id)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addHeaderRow}>+ Add Header</button>

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
