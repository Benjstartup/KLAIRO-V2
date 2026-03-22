"use client";

import { useRouter } from "next/navigation";
import { TIMEFRAMES, type Timeframe } from "@/types/market";
import { buildChartUrl } from "@/lib/chart-url";
import { saveChartPreferences } from "@/server/actions/chart-state";

interface Props {
  currentSymbol: string;
  currentTf: Timeframe;
  currentIndicators: string[];
}

export function TimeframeSelector({ currentSymbol, currentTf, currentIndicators }: Props) {
  const router = useRouter();

  function select(tf: Timeframe) {
    if (tf === currentTf) return;
    saveChartPreferences(tf, currentIndicators).catch(console.error);
    router.push(buildChartUrl(currentSymbol, tf, currentIndicators));
  }

  return (
    <div className="flex items-center gap-0.5">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          type="button"
          onClick={() => select(tf)}
          className={[
            "px-2.5 py-1 text-xs font-mono rounded transition-colors",
            tf === currentTf
              ? "bg-gray-700 text-white"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800",
          ].join(" ")}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
