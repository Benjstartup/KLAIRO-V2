"use client";

import { useRouter } from "next/navigation";
import { INDICATOR_LABELS, type IndicatorKey, type Timeframe } from "@/types/market";
import { buildChartUrl } from "@/lib/chart-url";
import { saveChartPreferences } from "@/server/actions/chart-state";

const INDICATOR_KEYS = Object.keys(INDICATOR_LABELS) as IndicatorKey[];

interface Props {
  currentSymbol: string;
  currentTf: Timeframe;
  currentIndicators: IndicatorKey[];
}

export function IndicatorSelector({ currentSymbol, currentTf, currentIndicators }: Props) {
  const router = useRouter();

  function toggle(key: IndicatorKey) {
    const next = currentIndicators.includes(key)
      ? currentIndicators.filter((k) => k !== key)
      : [...currentIndicators, key];
    saveChartPreferences(currentTf, next).catch(console.error);
    router.push(buildChartUrl(currentSymbol, currentTf, next));
  }

  return (
    <div className="flex items-center gap-0.5">
      {INDICATOR_KEYS.map((key) => {
        const active = currentIndicators.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={[
              "px-2 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap",
              active
                ? "bg-blue-600/30 text-blue-300 border border-blue-600/40"
                : "text-gray-600 hover:text-gray-400 hover:bg-gray-800",
            ].join(" ")}
          >
            {INDICATOR_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}
