"use client";

interface DataPreviewProps {
  data: any;
  loading: boolean;
  error: string;
}

export default function DataPreview({ data, loading, error }: DataPreviewProps) {
  return (
    <div style={{ marginTop: "2rem" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
