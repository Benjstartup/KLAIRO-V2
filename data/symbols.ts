// Lean static symbol universe for Phase 1.
// ~70 actively-traded US equities across key sectors.
// Replace with a fetched list in a later phase when needed.

export interface SymbolInfo {
  ticker: string;
  name: string;
}

export const SYMBOLS: SymbolInfo[] = [
  // Tech
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "NVDA", name: "NVIDIA Corp." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "META", name: "Meta Platforms Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "AMD", name: "Advanced Micro Devices" },
  { ticker: "INTC", name: "Intel Corp." },
  { ticker: "AVGO", name: "Broadcom Inc." },
  { ticker: "QCOM", name: "Qualcomm Inc." },
  { ticker: "MU", name: "Micron Technology" },
  { ticker: "AMAT", name: "Applied Materials" },
  { ticker: "ASML", name: "ASML Holding" },
  { ticker: "CRM", name: "Salesforce Inc." },
  { ticker: "ORCL", name: "Oracle Corp." },
  { ticker: "NOW", name: "ServiceNow Inc." },
  { ticker: "ADBE", name: "Adobe Inc." },
  { ticker: "SNOW", name: "Snowflake Inc." },
  { ticker: "PLTR", name: "Palantir Technologies" },
  // Finance
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "GS", name: "Goldman Sachs" },
  { ticker: "MS", name: "Morgan Stanley" },
  { ticker: "BAC", name: "Bank of America" },
  { ticker: "WFC", name: "Wells Fargo" },
  { ticker: "BRK.B", name: "Berkshire Hathaway B" },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "MA", name: "Mastercard Inc." },
  { ticker: "PYPL", name: "PayPal Holdings" },
  { ticker: "SQ", name: "Block Inc." },
  // Healthcare
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "UNH", name: "UnitedHealth Group" },
  { ticker: "LLY", name: "Eli Lilly and Co." },
  { ticker: "ABBV", name: "AbbVie Inc." },
  { ticker: "PFE", name: "Pfizer Inc." },
  { ticker: "MRK", name: "Merck & Co." },
  { ticker: "AMGN", name: "Amgen Inc." },
  { ticker: "GILD", name: "Gilead Sciences" },
  // Consumer
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "COST", name: "Costco Wholesale" },
  { ticker: "TGT", name: "Target Corp." },
  { ticker: "MCD", name: "McDonald's Corp." },
  { ticker: "SBUX", name: "Starbucks Corp." },
  { ticker: "NKE", name: "Nike Inc." },
  { ticker: "HD", name: "Home Depot" },
  { ticker: "LOW", name: "Lowe's Companies" },
  // Energy
  { ticker: "XOM", name: "Exxon Mobil Corp." },
  { ticker: "CVX", name: "Chevron Corp." },
  { ticker: "COP", name: "ConocoPhillips" },
  { ticker: "SLB", name: "SLB (Schlumberger)" },
  { ticker: "OXY", name: "Occidental Petroleum" },
  // Industrials
  { ticker: "BA", name: "Boeing Co." },
  { ticker: "CAT", name: "Caterpillar Inc." },
  { ticker: "HON", name: "Honeywell International" },
  { ticker: "GE", name: "GE Aerospace" },
  { ticker: "RTX", name: "RTX Corp." },
  { ticker: "LMT", name: "Lockheed Martin" },
  // Communications / Media
  { ticker: "NFLX", name: "Netflix Inc." },
  { ticker: "DIS", name: "Walt Disney Co." },
  { ticker: "T", name: "AT&T Inc." },
  { ticker: "VZ", name: "Verizon Communications" },
  { ticker: "CMCSA", name: "Comcast Corp." },
  // ETFs (popular reference instruments)
  { ticker: "SPY", name: "SPDR S&P 500 ETF" },
  { ticker: "QQQ", name: "Invesco QQQ ETF" },
  { ticker: "IWM", name: "iShares Russell 2000 ETF" },
  { ticker: "GLD", name: "SPDR Gold Shares" },
  { ticker: "TLT", name: "iShares 20+ Year Treasury ETF" },
  { ticker: "XLF", name: "Financial Select Sector SPDR" },
  { ticker: "XLE", name: "Energy Select Sector SPDR" },
  { ticker: "ARKK", name: "ARK Innovation ETF" },
];

export const DEFAULT_SYMBOL = "AAPL";

// Filter symbols by query string. Case-insensitive match on ticker or name.
export function filterSymbols(query: string): SymbolInfo[] {
  if (!query.trim()) return SYMBOLS.slice(0, 20);
  const q = query.toUpperCase().trim();
  return SYMBOLS.filter(
    (s) => s.ticker.startsWith(q) || s.name.toUpperCase().includes(q),
  ).slice(0, 20);
}
