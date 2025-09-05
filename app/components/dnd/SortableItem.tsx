"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const wrapperStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation",
    userSelect: "none",
    position: "relative",
    opacity: isDragging ? 0.96 : 1,
  };

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    top: 6,
    left: "50%",
    transform: "translateX(-50%)",
    cursor: "grab",
    padding: 6,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };

  return (
    <div ref={setNodeRef} style={wrapperStyle}>
      <div {...attributes} {...listeners} style={handleStyle} aria-label="Drag handle" role="button" tabIndex={0}>
        <svg width="34" height="20" viewBox="0 0 34 20" fill="none" aria-hidden>
          {/* top row */}
          <circle cx="5" cy="6" r="2" fill="currentColor" />
          <circle cx="12.5" cy="6" r="2" fill="currentColor" />
          <circle cx="20" cy="6" r="2" fill="currentColor" />
          <circle cx="27.5" cy="6" r="2" fill="currentColor" />
          {/* bottom row */}
          <circle cx="5" cy="14" r="2" fill="currentColor" />
          <circle cx="12.5" cy="14" r="2" fill="currentColor" />
          <circle cx="20" cy="14" r="2" fill="currentColor" />
          <circle cx="27.5" cy="14" r="2" fill="currentColor" />
        </svg>
      </div>

      <div style={{ paddingTop: 18 /* give space so handle doesn't overlap top content */ }}>{children}</div>
    </div>
  );
}
