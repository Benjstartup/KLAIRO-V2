// Deterministic synthetic OHLCV generator.
// Same symbol always produces the same candles — safe to use in dev and tests.

import type { Candle, Timeframe } from "@/types/market";
import type { MarketDataAdapter } from "../types";

// FNV-1a 32-bit seeded RNG — fast and deterministic from a string seed.
function seedRng(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return ((h >>> 0) / 4294967296);
  };
}

// Generate N business days ending today, chronologically.
function businessDaysBack(n: number): Date[] {
  const dates: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (dates.length < n) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) dates.unshift(new Date(d));
    d.setDate(d.getDate() - 1);
  }
  return dates;
}

// Aggregate daily candles into weekly (Monday-anchored).
function toWeekly(daily: Candle[]): Candle[] {
  const weeks = new Map<string, Candle[]>();
  for (const c of daily) {
    const d = new Date(c.time * 1000);
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    if (!weeks.has(key)) weeks.set(key, []);
    weeks.get(key)!.push(c);
  }
  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, cs]) => ({
      time: cs[0].time,
      open: cs[0].open,
      high: Math.max(...cs.map((c) => c.high)),
      low: Math.min(...cs.map((c) => c.low)),
      close: cs[cs.length - 1].close,
      volume: cs.reduce((s, c) => s + c.volume, 0),
    }));
}

// Aggregate daily candles into monthly (first-day-of-month-anchored).
function toMonthly(daily: Candle[]): Candle[] {
  const months = new Map<string, Candle[]>();
  for (const c of daily) {
    const d = new Date(c.time * 1000);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key)!.push(c);
  }
  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, cs]) => ({
      time: cs[0].time,
      open: cs[0].open,
      high: Math.max(...cs.map((c) => c.high)),
      low: Math.min(...cs.map((c) => c.low)),
      close: cs[cs.length - 1].close,
      volume: cs.reduce((s, c) => s + c.volume, 0),
    }));
}

export const mockAdapter: MarketDataAdapter = {
  async candles(symbol: string, timeframe: Timeframe, limit = 500): Promise<Candle[]> {
    const rng = seedRng(symbol.toUpperCase());

    // Starting price: $20–$500 based on symbol
    const startPrice = 20 + rng() * 480;
    const baseVolume = Math.floor(500_000 + rng() * 9_500_000);

    const dates = businessDaysBack(500);
    let price = startPrice;

    const daily: Candle[] = dates.map((d) => {
      // Slight upward bias, realistic daily return distribution
      const r = (rng() - 0.47) * 0.03;
      const open = parseFloat(price.toFixed(2));
      price = Math.max(price * (1 + r), 0.01);
      const close = parseFloat(price.toFixed(2));

      // Intraday range as fraction of price
      const rangeFactor = rng() * 0.015;
      const high = parseFloat((Math.max(open, close) * (1 + rangeFactor)).toFixed(2));
      const low = parseFloat((Math.min(open, close) * (1 - rangeFactor)).toFixed(2));
      const volume = Math.floor(baseVolume * (0.5 + rng() * 1.5));

      return { time: Math.floor(d.getTime() / 1000), open, high, low, close, volume };
    });

    let result: Candle[];
    if (timeframe === "1W") result = toWeekly(daily);
    else if (timeframe === "1M") result = toMonthly(daily);
    else result = daily;

    return result.slice(-limit);
  },
};
