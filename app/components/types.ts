export type LayoutType = "json" | "table" | "card";

export interface NewWidgetConfig {
  name: string;
  apiUrl: string;
  apiKey?: string;
  interval: number;
  layout: LayoutType;
  symbols?: string[];
  headers?: Record<string, string>;
  preset?: string;
  chartField?: string; 
}

export interface WidgetConfig extends NewWidgetConfig {
  id: string;
  lastData?: any;
  lastUpdated?: number;
}
