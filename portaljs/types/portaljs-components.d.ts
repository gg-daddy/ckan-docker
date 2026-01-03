// Type declarations for @portaljs/components
// This file exists because the package.json exports don't properly expose types

declare module '@portaljs/components' {
  import { ComponentType } from 'react';

  // FlatUiTable component
  export interface FlatUiTableProps {
    data?: {
      values?: Record<string, unknown>[];
      fields?: { name: string; type?: string }[];
    };
    uniqueId?: string;
    columns?: Array<{ field: string; header?: string }>;
    rawCsv?: string;
    url?: string;
    bytes?: string;
  }
  export const FlatUiTable: ComponentType<FlatUiTableProps>;

  // PlotlyBarChart component
  export interface PlotlyBarChartProps {
    data?: Record<string, unknown>[];
    xAxis?: string;
    yAxis?: string;
    title?: string;
  }
  export const PlotlyBarChart: ComponentType<PlotlyBarChartProps>;

  // PlotlyLineChart component
  export interface PlotlyLineChartProps {
    data?: Record<string, unknown>[];
    xAxis?: string;
    yAxis?: string;
    title?: string;
  }
  export const PlotlyLineChart: ComponentType<PlotlyLineChartProps>;

  // LineChart component
  export interface LineChartProps {
    data?: Record<string, unknown>[];
    xAxis?: string;
    yAxis?: string;
    title?: string;
  }
  export const LineChart: ComponentType<LineChartProps>;

  // Map component
  export interface MapProps {
    data?: Record<string, unknown>[];
    layers?: Array<{
      id: string;
      type: string;
      source: string;
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }>;
    center?: [number, number];
    zoom?: number;
    title?: string;
  }
  export const Map: ComponentType<MapProps>;

  // Excel component
  export interface ExcelProps {
    url?: string;
    data?: unknown;
  }
  export const Excel: ComponentType<ExcelProps>;

  // PdfViewer component
  export interface PdfViewerProps {
    url?: string;
    parentRef?: React.RefObject<HTMLDivElement>;
  }
  export const PdfViewer: ComponentType<PdfViewerProps>;

  // VegaLite component
  export interface VegaLiteProps {
    spec?: Record<string, unknown>;
    data?: Record<string, unknown>[];
  }
  export const VegaLite: ComponentType<VegaLiteProps>;

  // Plotly component
  export interface PlotlyProps {
    data?: Record<string, unknown>[];
    layout?: Record<string, unknown>;
    config?: Record<string, unknown>;
  }
  export const Plotly: ComponentType<PlotlyProps>;
}
