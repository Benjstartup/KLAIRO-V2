import type { Candle, Timeframe } from "@/types/market";

// Provider-agnostic interface. Swap implementations without touching business logic.
export interface MarketDataAdapter {
  candles(symbol: string, timeframe: Timeframe, limit?: number): Promise<Candle[]>;
}
