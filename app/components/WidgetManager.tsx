"use client";
import { useState } from "react";
import AddWidgetModal from "./AddWidgetModal";
import WidgetCard from "./WidgetCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./dnd/SortableItem";
import { useWidgetStore } from "../store/widgetStore";
import ThemeToggle from "./ThemeToggle";

export default function WidgetManager() {
  const { widgets, addWidget, deleteWidget, reorderWidgets } = useWidgetStore();
  const [showModal, setShowModal] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="button" onClick={() => setShowModal(true)} style={{ padding: "10px 18px", fontSize: 16, fontWeight: 600, borderRadius: 8, background: "var(--btn-bg, #e0e7ff)", color: "var(--btn-fg, #2563eb)", boxShadow: "0 1px 4px rgba(30,64,175,0.07)", border: "none", transition: "background 0.2s, color 0.2s" }}>+ Add Widget</button>
          <ThemeToggle />
        </div>
        <div style={{ color: "#666", fontSize: 14 }}>Drag by the handle (top center). Widgets wrap into rows.</div>
      </div>

      {showModal && <AddWidgetModal onClose={() => setShowModal(false)} onSave={addWidget} />}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(540px, 1fr))",
            gap: "2vw",
            alignItems: "start",
            width: "100%"
          }}>
            {widgets.map((widget) => (
              <SortableItem key={widget.id} id={widget.id}>
                <WidgetCard {...widget} onDelete={() => deleteWidget(widget.id)} />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
