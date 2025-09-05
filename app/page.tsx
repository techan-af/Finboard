import WidgetManager from "./components/WidgetManager";

export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--header-bg, #f9f9ff)",
        color: "var(--header-fg, #222)",
        padding: "32px 24px 20px 24px",
        boxShadow: "0 2px 12px rgba(30,64,175,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 80,
      }}>
  <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5, margin: 0 }}>FinBoard Dashboard</h1>
        {/* You can add logo or theme toggle here if needed */}
      </header>
      <main style={{ padding: 24 }}>
        <WidgetManager />
      </main>
      <style>{`
        .dark header {
          --header-bg: #222831;
          --header-fg: #e3eafc;
        }
        header {
          --header-bg: #f9f9ff;
          --header-fg: #222;
        }
      `}</style>
    </div>
  );
}
