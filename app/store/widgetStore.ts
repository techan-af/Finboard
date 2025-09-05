import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WidgetConfig, NewWidgetConfig } from "../components/types";

interface WidgetState {
  widgets: WidgetConfig[];
  addWidget: (widget: NewWidgetConfig) => void;
  deleteWidget: (id: string) => void;
  reorderWidgets: (widgets: WidgetConfig[]) => void;
  updateWidgetData: (id: string, data: any) => void;
  updateWidget: (id: string, widget: NewWidgetConfig) => void;
  clearAll: () => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: [],
      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, { ...widget, id: Date.now().toString() }],
        })),
      deleteWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
      reorderWidgets: (newWidgets) => set({ widgets: newWidgets }),
      updateWidgetData: (id, data) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, lastData: data, lastUpdated: Date.now() } : w)),
        })),
      updateWidget: (id, widget) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...widget } : w)),
        })),
      clearAll: () => set({ widgets: [] }),
    }),
    { name: "finboard-widgets" }
  )
);
