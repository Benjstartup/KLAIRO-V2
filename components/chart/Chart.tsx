"use client";

// One client component for the entire chart.
// Uses lightweight-charts v5 via dynamic import to avoid SSR issues.
// Chart is fully recreated on every data change (symbol / timeframe / indicators).
// Plain helper functions handle series setup — no CandleSeries/VolumeSeries/IndicatorSeries
// React components.

import { useEffect, useRef } from "react";
import type { CandleResponse } from "@/types/market";

// Indicator line colors for overlay series (pane 0)
const OVERLAY_COLORS: Record<string, string> = {
  SMA20: "#3b82f6", // blue
  SMA50: "#f59e0b", // amber
  EMA20: "#8b5cf6", // violet
  EMA50: "#ec4899", // pink
  VWAP: "#06b6d4",  // cyan
};

interface Props {
  data: CandleResponse;
}

export default function Chart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null;
    let ro: ResizeObserver | null = null;

    import("lightweight-charts").then((lc) => {
      if (cancelled || !containerRef.current) return;

      const {
        createChart,
        ColorType,
        CrosshairMode,
        CandlestickSeries,
        HistogramSeries,
        LineSeries,
      } = lc;

      const container = containerRef.current;

      chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: "#030712" },
          textColor: "#9ca3af",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: "#111827" },
          horzLines: { color: "#111827" },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: "#1f2937" },
        timeScale: {
          borderColor: "#1f2937",
          timeVisible: false,
        },
        width: container.clientWidth,
        height: container.clientHeight,
      });

      // ── Candlestick series (pane 0) ──────────────────────────────
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      candleSeries.setData(
        data.candles.map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })),
      );

      // ── Volume histogram (pane 0, separate price scale) ──────────
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      // Collapse volume to bottom 15% of the pane
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volumeSeries.setData(
        data.candles.map((c) => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? "#16a34a44" : "#dc262644",
        })),
      );

      // ── Overlay indicators (pane 0) ───────────────────────────────
      const mainInds = data.indicators.filter((i) => i.pane === "main");
      for (const ind of mainInds) {
        const line = chart.addSeries(LineSeries, {
          color: OVERLAY_COLORS[ind.key] ?? "#94a3b8",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        line.setData(ind.data.map((p) => ({ time: p.time, value: p.value })));
      }

      // ── RSI (pane 1, if enabled) ──────────────────────────────────
      const rsiInd = data.indicators.find((i) => i.key === "RSI");
      let nextPane = 1;
      if (rsiInd) {
        const rsiSeries = chart.addSeries(
          LineSeries,
          {
            color: "#a78bfa",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: true,
          },
          nextPane,
        );
        rsiSeries.setData(rsiInd.data.map((p) => ({ time: p.time, value: p.value })));
        nextPane++;
      }

      // ── MACD histogram (pane 1 or 2, if enabled) ─────────────────
      const macdInd = data.indicators.find((i) => i.key === "MACD");
      if (macdInd) {
        const macdSeries = chart.addSeries(
          HistogramSeries,
          {
            priceLineVisible: false,
            lastValueVisible: false,
          },
          nextPane,
        );
        macdSeries.setData(
          macdInd.data.map((p) => ({
            time: p.time,
            value: p.value,
            color: p.value >= 0 ? "#22c55e88" : "#ef444488",
          })),
        );
      }

      chart.timeScale().fitContent();

      // Resize observer keeps chart filling its container
      ro = new ResizeObserver(() => {
        if (chart && container) {
          chart.applyOptions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      });
      ro.observe(container);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      chart?.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}
