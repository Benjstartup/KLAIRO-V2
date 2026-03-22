// Shared market data types used across server and client.

export type Timeframe = "1D" | "1W" | "1M";

export const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M"];

export type IndicatorKey =
  | "SMA20"
  | "SMA50"
  | "EMA20"
  | "EMA50"
  | "VWAP"
  | "RSI"
  | "MACD";

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  SMA20: "SMA 20",
  SMA50: "SMA 50",
  EMA20: "EMA 20",
  EMA50: "EMA 50",
  VWAP: "Daily VWAP",
  RSI: "RSI 14",
  MACD: "MACD",
};

// Which pane an indicator renders in.
export type IndicatorPane = "main" | "sub";

export const INDICATOR_PANE: Record<IndicatorKey, IndicatorPane> = {
  SMA20: "main",
  SMA50: "main",
  EMA20: "main",
  EMA50: "main",
  VWAP: "main",
  RSI: "sub",
  MACD: "sub",
};

export interface Candle {
  time: number; // Unix timestamp, seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorPoint {
  time: number;
  value: number;
}

export interface IndicatorSeries {
  key: IndicatorKey;
  label: string;
  pane: IndicatorPane;
  data: IndicatorPoint[];
}

export interface CandleResponse {
  symbol: string;
  timeframe: Timeframe;
  candles: Candle[];
  indicators: IndicatorSeries[];
  // "mock" = synthetic data; "live" = real market data from a provider.
  // Always check this before trusting prices.
  dataSource: "mock" | "live";
}

// Type guard for IndicatorKey
const VALID_INDICATOR_KEYS = Object.keys(INDICATOR_LABELS) as IndicatorKey[];

export function isIndicatorKey(val: string): val is IndicatorKey {
  return VALID_INDICATOR_KEYS.includes(val as IndicatorKey);
}

// Type guard for Timeframe
const VALID_TIMEFRAMES = TIMEFRAMES as readonly string[];

export function isTimeframe(val: string): val is Timeframe {
  return VALID_TIMEFRAMES.includes(val);
}
