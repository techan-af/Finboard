"use client";
import { useState } from "react";

interface ApiInputProps {
  onFetch: (url: string) => void;
}

export default function ApiInput({ onFetch }: ApiInputProps) {
  const [apiUrl, setApiUrl] = useState("");

  const handleClick = () => {
    if (apiUrl.trim()) {
      onFetch(apiUrl);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Enter API URL"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        style={{ width: "400px", marginRight: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleClick} style={{ padding: "0.5rem 1rem" }}>
        Fetch Data
      </button>
    </div>
  );
}
