"use client";
import { JSX, useEffect, useState } from "react";
import type { WidgetConfig } from "./types";
import { useWidgetStore } from "../store/widgetStore";
import EditWidgetModal from "./EditWidgetModal";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { RefreshCw, Settings, Trash2 } from "lucide-react";

const LABELS: Record<string, string> = {
  c: "Current Price",
  d: "Change",
  dp: "Percent Change",
  h: "High",
  l: "Low",
  o: "Open",
  pc: "Previous Close",
  t: "Timestamp",
};

interface Props extends WidgetConfig {
  onDelete: () => void;
}

export default function WidgetCard({
  id,
  name,
  apiUrl,
  apiKey,
  interval,
  layout,
  symbols,
  headers,
  chartField,
  lastData,
  lastUpdated,
  onDelete,
}: Props) {
  const [data, setData] = useState<any>(lastData ?? null);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const updateWidgetData = useWidgetStore((s) => s.updateWidgetData);
  const updateWidget = useWidgetStore((s) => s.updateWidget);

  const buildHeaders = (): Record<string, string> | undefined => {
    const h: Record<string, string> = {};
    if (headers) Object.assign(h, headers);
    const hasAuthHeader = Object.keys(h).some((k) =>
      ["x-api-key", "authorization", "apikey", "api-key"].includes(k.toLowerCase())
    );
    if (apiKey && apiKey.trim() && !hasAuthHeader) {
      h["X-Api-Key"] = apiKey.trim();
    }
    return Object.keys(h).length ? h : undefined;
  };

  const fetchSingle = async (url: string, options: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  };

  const fetchData = async () => {
    if (!apiUrl) return;
    try {
      setError("");

      if (lastData && lastUpdated && Date.now() - lastUpdated < interval * 1000) {
        setData(lastData);
        return;
      }

      const headerObj = buildHeaders();
      const options: RequestInit = headerObj ? { headers: headerObj } : {};

      // Multiple symbols (table mode)
      if (layout === "table" && symbols && symbols.length > 0) {
        const responses = await Promise.all(
          symbols.map(async (sym) => {
            let url = apiUrl.includes("?")
              ? `${apiUrl}&symbol=${encodeURIComponent(sym)}`
              : `${apiUrl}?symbol=${encodeURIComponent(sym)}`;
            if (!headerObj && apiKey?.trim()) {
              url += url.includes("?")
                ? `&token=${encodeURIComponent(apiKey.trim())}`
                : `?token=${encodeURIComponent(apiKey.trim())}`;
            }
            try {
              const json = await fetchSingle(url, options);
              return { __symbol: sym, ...json };
            } catch (err: any) {
              return { __symbol: sym, error: err.message || "Fetch failed" };
            }
          })
        );
        setData(responses);
        updateWidgetData(id, responses);
        return;
      }

      // Single fetch
      let url = apiUrl;
      if (!headerObj && apiKey?.trim()) {
        url += url.includes("?")
          ? `&token=${encodeURIComponent(apiKey.trim())}`
          : `?token=${encodeURIComponent(apiKey.trim())}`;
      }
      const json = await fetchSingle(url, options);

      // Normalize Alpha Vantage / time-series
      let normalized = json;
      const timeSeriesKey = Object.keys(json).find((k) =>
        k.toLowerCase().includes("time series")
      );
      if (timeSeriesKey && typeof json[timeSeriesKey] === "object") {
        const seriesObj = json[timeSeriesKey] as Record<string, any>;
        normalized = Object.entries(seriesObj).map(([time, values]) => ({
          x: time,
          y:
            parseFloat(
              values[chartField || "4. close"] ??
                values["4. close"] ??
                Object.values(values)[0]
            ) || 0,
          ...values,
        }));
      }

      setData(normalized);
      updateWidgetData(id, normalized);
    } catch (err: any) {
      setError(err.message || "Fetch failed");
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, Math.max(1, interval) * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, apiKey, interval, JSON.stringify(symbols), JSON.stringify(headers), chartField]);

  // --- render helpers ---
  const renderKeyValueTable = (obj: Record<string, any>) => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {Object.entries(obj).map(([k, v]) => (
          <tr key={k}>
            <td style={{ border: "1px solid #eee", padding: 8, fontWeight: 600 }}>
              {LABELS[k] || k}
            </td>
            <td style={{ border: "1px solid #f7f7f7", padding: 8 }}>
              {v && typeof v === "object" ? JSON.stringify(v, null, 1) : String(v)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderArrayTable = (arr: any[]) => {
    if (!arr.length) return <p>No data</p>;
    if (typeof arr[0] !== "object") {
      return <ul>{arr.map((a, i) => <li key={i}>{String(a)}</li>)}</ul>;
    }
    const headers: string[] = Array.from(
      arr.reduce((s, r) => {
        Object.keys(r).forEach((k) => s.add(k));
        return s;
      }, new Set<string>())
    );
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{ border: "1px solid #eee", padding: 8, textAlign: "left" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arr.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => {
                  let val = row[h];
                  if (val && typeof val === "object") {
                    try {
                      val = JSON.stringify(val, null, 1);
                    } catch {
                      val = String(val);
                    }
                  }
                  return (
                    <td
                      key={h}
                      style={{ border: "1px solid #f7f7f7", padding: 8, whiteSpace: "pre-wrap" }}
                    >
                      {val !== undefined ? String(val) : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = (arr: any[]) => {
    if (!Array.isArray(arr) || !arr.length) return <p>No chart data</p>;
    const chartData = arr.map((d, i) => ({
      x: d.x || i,
      y: d.y ?? d.close ?? d["4. close"] ?? d.c,
    }));
    return (
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  let body: JSX.Element | null = null;
  if (Array.isArray(data)) {
    body = layout === "json" ? renderChart(data) : renderArrayTable(data);
  } else if (data && typeof data === "object") {
    body =
      layout === "json" ? (
        <pre style={{ maxHeight: 220, overflow: "auto", margin: 0 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        renderArrayTable([data])
      );
  } else {
    body = <p style={{ margin: 0 }}>No data</p>;
  }

  // Theme-aware card style
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e6e6e6",
    padding: "1rem",
    paddingTop: 30,
    borderRadius: 16,
    background: "var(--card-bg, #fff)",
    color: "var(--card-fg, #222)",
    height: "420px",
    maxWidth: "100%",
    width: "100%",
    position: "relative",
    boxShadow: "0 2px 8px rgba(30,64,175,0.08)",
    transition: "background 0.3s, color 0.3s",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    boxSizing: "border-box",
  };

  // Sleek, theme-aware button style
  const iconBtnStyle: React.CSSProperties = {
    background: "var(--btn-bg, #e0e7ff)",
    border: "none",
    padding: "7px 10px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "var(--btn-fg, #2563eb)",
    fontWeight: 500,
    boxShadow: "0 1px 4px rgba(30,64,175,0.07)",
    transition: "background 0.2s, color 0.2s",
  };

  // Inject theme CSS vars for dark mode
  const themeVars = (
    <style>{`
      .dark .finboard-card {
        --card-bg: #222831;
        --card-fg: #e3eafc;
        --btn-bg: #313d58ff;
        --btn-fg: #60a5fa;
      }
      .finboard-card {
        --card-bg: #f9f9ff;
        --card-fg: #222;
        --btn-bg: #e0e7ff;
        --btn-fg: #2563eb;
      }
    `}</style>
  );

  return (
    <div className="finboard-card" style={cardStyle}>
      {themeVars}
  {/* Only render the intended drag handle via SortableItem, no extra element above the widget name */}
      {/* Widget header and controls with hierarchy */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        width: "100%",
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 6, letterSpacing: 0.5 }}>
          {name}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button type="button" onClick={fetchData} style={iconBtnStyle} title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button type="button" onClick={() => setShowEdit(true)} style={iconBtnStyle} title="Settings">
            <Settings size={18} />
          </button>
          <button type="button" onClick={onDelete} style={{ ...iconBtnStyle, color: "#e11d48", background: "var(--btn-bg, #e0e7ff)" }} title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <div>{body}</div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>Every {interval}s</div>

      {showEdit && (
        <EditWidgetModal
          widget={{
            id,
            name,
            apiUrl,
            apiKey,
            interval,
            layout,
            symbols,
            headers,
            chartField,
          }}
          onClose={() => setShowEdit(false)}
          onSave={(w) => updateWidget(id, w)}
        />
      )}
    </div>
  );
}
