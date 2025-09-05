"use client";
import { useState } from "react";
import ApiInput from "./ApiInput";
import DataPreview from "./DataPreview";

export default function Widget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (url: string) => {
    try {
      setLoading(true);
      setError("");
      setData(null);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ApiInput onFetch={handleFetch} />
      <DataPreview data={data} loading={loading} error={error} />
    </div>
  );
}
