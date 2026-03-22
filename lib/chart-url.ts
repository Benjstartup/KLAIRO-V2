// Shared URL builder for chart state changes.
// All chart client components use this to produce consistent URLs.

export function buildChartUrl(
  symbol: string,
  tf: string,
  indicators: string[],
): string {
  const params = new URLSearchParams();
  params.set("symbol", symbol);
  params.set("tf", tf);
  // Always include ?ind= so URL presence always takes precedence over DB state.
  // Empty string → no indicators; avoids race between server action + server render.
  params.set("ind", indicators.join(","));
  return `/workspace?${params.toString()}`;
}
