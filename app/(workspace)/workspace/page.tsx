import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { getChartData } from "@/server/market-data";
import { isIndicatorKey, isTimeframe, type IndicatorKey, type Timeframe } from "@/types/market";
import { SymbolSearch } from "@/components/symbol-search/SymbolSearch";
import { TimeframeSelector } from "@/components/timeframe-selector/TimeframeSelector";
import { IndicatorSelector } from "@/components/indicator-selector/IndicatorSelector";
// Chart is "use client" — lightweight-charts is loaded only in useEffect, so SSR is safe.
import Chart from "@/components/chart/Chart";

export const metadata: Metadata = { title: "Workspace" };

// Sidebar nav items — inactive links for future phases.
const NAV_ITEMS = [
  { label: "Charts", active: true },
  { label: "Scanner", phase: "Phase 2" },
  { label: "Watchlists", phase: "Phase 2" },
  { label: "Alerts", phase: "Phase 4" },
  { label: "Journal", phase: "Phase 5" },
] as const;

type SearchParams = Promise<{ symbol?: string; tf?: string; ind?: string }>;

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  // ── Resolve chart state from URL → saved preferences → defaults ──────────
  const params = await searchParams;

  // Ensure workspace exists on first visit
  const [workspace, preferences] = await Promise.all([
    db.workspace.upsert({
      where: { userId },
      update: {},
      create: { userId, name: "Default", settings: {} },
    }),
    db.userPreferences.findUnique({ where: { userId } }),
  ]);

  const savedSettings = (workspace.settings as Record<string, string>) ?? {};
  // No hardcoded default — undefined means "no symbol yet, show empty state".
  const savedSymbol: string | undefined = savedSettings.lastSymbol || undefined;
  const savedTf = preferences?.defaultTimeframe ?? "1D";
  const savedIndicators = (preferences?.defaultIndicators ?? []) as string[];

  // Precedence: URL param → saved workspace → empty state (no chart)
  const symbol: string | undefined = params.symbol || savedSymbol;
  const tf: Timeframe = isTimeframe(params.tf ?? "") ? (params.tf as Timeframe) : (isTimeframe(savedTf) ? savedTf : "1D");
  const indicators: IndicatorKey[] = (params.ind?.split(",") ?? savedIndicators).filter(isIndicatorKey);

  // ── Fetch chart data only when a symbol is resolved ───────────────────────
  const chartData = symbol ? await getChartData(symbol, tf, indicators) : undefined;

  // ── Sign-out action ───────────────────────────────────────────────────────
  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-56 flex flex-col border-r border-gray-800 shrink-0">
        {/* Wordmark */}
        <div className="h-12 px-5 flex items-center border-b border-gray-800">
          <span className="text-sm font-semibold text-white tracking-tight">Klairo</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Modules
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <span
                  className={[
                    "flex items-center justify-between px-2 py-1.5 rounded-md text-sm select-none",
                    "active" in item && item.active
                      ? "text-gray-200 bg-gray-800/60"
                      : "text-gray-500",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  {"phase" in item && (
                    <span className="text-[10px] text-gray-700 font-mono">{item.phase}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-gray-800">
          <div className="px-2 mb-1.5">
            <p className="text-xs text-gray-400 truncate">
              {session.user.name ?? session.user.email}
            </p>
            {session.user.name && (
              <p className="text-[11px] text-gray-600 truncate">{session.user.email}</p>
            )}
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-400 transition-colors rounded cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-12 px-4 flex items-center gap-3 border-b border-gray-800 shrink-0">
          {/* Symbol search is always visible — it is the entry point */}
          <SymbolSearch
            currentSymbol={symbol ?? ""}
            currentTf={tf}
            currentIndicators={indicators}
          />

          {/* Timeframe, indicators, and data badge only make sense once a chart is loaded */}
          {symbol && chartData && (
            <>
              <div className="w-px h-5 bg-gray-800 shrink-0" />
              <TimeframeSelector
                currentSymbol={symbol}
                currentTf={tf}
                currentIndicators={indicators}
              />
              <div className="w-px h-5 bg-gray-800 shrink-0" />
              <IndicatorSelector
                currentSymbol={symbol}
                currentTf={tf}
                currentIndicators={indicators}
              />
              {chartData.dataSource === "mock" && (
                <div className="ml-auto shrink-0 flex items-center gap-1.5 px-2 py-1 rounded border border-yellow-800/50 bg-yellow-950/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 shrink-0" />
                  <span className="text-[10px] font-mono text-yellow-600 uppercase tracking-wider whitespace-nowrap">
                    Simulated data
                  </span>
                </div>
              )}
            </>
          )}
        </header>

        {/* Chart or empty state */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {symbol && chartData ? (
            <Chart data={chartData} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">No chart loaded</p>
                <p className="text-xs text-gray-600">
                  Search for a symbol above to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
