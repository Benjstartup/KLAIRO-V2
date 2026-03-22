// Polygon.io adapter — Phase 1 placeholder.
// Wire this up when POLYGON_API_KEY is added to env and the adapter is needed.
// Replace mockAdapter with polygonAdapter in server/market-data/index.ts.

import type { Candle, Timeframe } from "@/types/market";
import type { MarketDataAdapter } from "../types";

const TIMEFRAME_MAP: Record<Timeframe, { multiplier: number; timespan: string }> = {
  "1D": { multiplier: 1, timespan: "day" },
  "1W": { multiplier: 1, timespan: "week" },
  "1M": { multiplier: 1, timespan: "month" },
};

export const polygonAdapter: MarketDataAdapter = {
  async candles(symbol: string, timeframe: Timeframe, limit = 500): Promise<Candle[]> {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) throw new Error("POLYGON_API_KEY is not set");

    const { multiplier, timespan } = TIMEFRAME_MAP[timeframe];
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - limit * 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=${limit}&apiKey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Polygon error: ${res.status}`);

    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (json.results ?? []).map((r: any) => ({
      time: Math.floor(r.t / 1000),
      open: r.o,
      high: r.h,
      low: r.l,
      close: r.c,
      volume: r.v,
    }));
  },
};
