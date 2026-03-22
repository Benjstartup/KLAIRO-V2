// Single source of truth for chart data.
// Workspace page and any future API route both call this function — never duplicate this logic.

import { buildIndicatorSeries } from "@/server/indicators";
import type { CandleResponse, IndicatorKey, Timeframe } from "@/types/market";
import { mockAdapter } from "./adapters/mock";

// Swap to polygonAdapter when POLYGON_API_KEY is available.
// Update dataSource to "live" at the same time.
const adapter = mockAdapter;
const dataSource: CandleResponse["dataSource"] = "mock";

export async function getChartData(
  symbol: string,
  timeframe: Timeframe,
  indicators: IndicatorKey[] = [],
): Promise<CandleResponse> {
  const candles = await adapter.candles(symbol.toUpperCase(), timeframe);
  const indicatorSeries = indicators.map((key) => buildIndicatorSeries(key, candles));
  return { symbol: symbol.toUpperCase(), timeframe, candles, indicators: indicatorSeries, dataSource };
}
