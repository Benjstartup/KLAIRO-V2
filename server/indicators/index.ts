// Pure server-side indicator functions.
// All functions are stateless and deterministic for the same inputs.

import type { Candle, IndicatorKey, IndicatorPoint, IndicatorSeries } from "@/types/market";
import { INDICATOR_LABELS, INDICATOR_PANE } from "@/types/market";

// Simple Moving Average
export function sma(candles: Candle[], period: number): IndicatorPoint[] {
  const result: IndicatorPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    result.push({ time: candles[i].time, value: parseFloat((sum / period).toFixed(4)) });
  }
  return result;
}

// Exponential Moving Average
export function ema(candles: Candle[], period: number): IndicatorPoint[] {
  if (candles.length < period) return [];
  const k = 2 / (period + 1);
  const result: IndicatorPoint[] = [];

  // Seed with SMA of first `period` bars
  let val = 0;
  for (let i = 0; i < period; i++) val += candles[i].close;
  val /= period;
  result.push({ time: candles[period - 1].time, value: parseFloat(val.toFixed(4)) });

  for (let i = period; i < candles.length; i++) {
    val = candles[i].close * k + val * (1 - k);
    result.push({ time: candles[i].time, value: parseFloat(val.toFixed(4)) });
  }
  return result;
}

// Daily VWAP — cumulative from start of dataset.
// On daily bars, each bar is one day; we anchor from the first available bar.
export function vwap(candles: Candle[]): IndicatorPoint[] {
  let cumTPV = 0;
  let cumVol = 0;
  return candles.map((c) => {
    const tp = (c.high + c.low + c.close) / 3;
    cumTPV += tp * c.volume;
    cumVol += c.volume;
    const value = cumVol === 0 ? tp : cumTPV / cumVol;
    return { time: c.time, value: parseFloat(value.toFixed(4)) };
  });
}

// Relative Strength Index (Wilder smoothing)
export function rsi(candles: Candle[], period = 14): IndicatorPoint[] {
  if (candles.length < period + 1) return [];

  const result: IndicatorPoint[] = [];

  // Initial averages from first `period` price changes
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;

  const calcRsi = (ag: number, al: number) =>
    al === 0 ? 100 : 100 - 100 / (1 + ag / al);

  result.push({ time: candles[period].time, value: parseFloat(calcRsi(avgGain, avgLoss).toFixed(2)) });

  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = Math.max(diff, 0);
    const loss = Math.max(-diff, 0);
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result.push({ time: candles[i].time, value: parseFloat(calcRsi(avgGain, avgLoss).toFixed(2)) });
  }
  return result;
}

// MACD histogram (EMA12 - EMA26, signal EMA9, returns histogram values)
export function macd(
  candles: Candle[],
  fast = 12,
  slow = 26,
  signal = 9,
): IndicatorPoint[] {
  const fastEma = ema(candles, fast);
  const slowEma = ema(candles, slow);

  // Align on time
  const fastMap = new Map(fastEma.map((p) => [p.time, p.value]));
  const macdLine: IndicatorPoint[] = slowEma
    .filter((p) => fastMap.has(p.time))
    .map((p) => ({ time: p.time, value: (fastMap.get(p.time) ?? 0) - p.value }));

  if (macdLine.length < signal) return [];

  const k = 2 / (signal + 1);
  let sigVal = macdLine.slice(0, signal).reduce((s, p) => s + p.value, 0) / signal;

  const result: IndicatorPoint[] = [];
  result.push({
    time: macdLine[signal - 1].time,
    value: parseFloat((macdLine[signal - 1].value - sigVal).toFixed(4)),
  });

  for (let i = signal; i < macdLine.length; i++) {
    sigVal = macdLine[i].value * k + sigVal * (1 - k);
    result.push({
      time: macdLine[i].time,
      value: parseFloat((macdLine[i].value - sigVal).toFixed(4)),
    });
  }
  return result;
}

// Build a typed IndicatorSeries from a key + candles
export function buildIndicatorSeries(key: IndicatorKey, candles: Candle[]): IndicatorSeries {
  const label = INDICATOR_LABELS[key];
  const pane = INDICATOR_PANE[key];

  switch (key) {
    case "SMA20": return { key, label, pane, data: sma(candles, 20) };
    case "SMA50": return { key, label, pane, data: sma(candles, 50) };
    case "EMA20": return { key, label, pane, data: ema(candles, 20) };
    case "EMA50": return { key, label, pane, data: ema(candles, 50) };
    case "VWAP":  return { key, label, pane, data: vwap(candles) };
    case "RSI":   return { key, label, pane, data: rsi(candles, 14) };
    case "MACD":  return { key, label, pane, data: macd(candles) };
  }
}
