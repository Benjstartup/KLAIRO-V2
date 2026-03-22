"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { filterSymbols } from "@/data/symbols";
import { buildChartUrl } from "@/lib/chart-url";
import { saveLastSymbol } from "@/server/actions/chart-state";

interface Props {
  currentSymbol: string;
  currentTf: string;
  currentIndicators: string[];
}

export function SymbolSearch({ currentSymbol, currentTf, currentIndicators }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = filterSymbols(query);

  function select(ticker: string) {
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
    saveLastSymbol(ticker).catch(console.error);
    router.push(buildChartUrl(ticker, currentTf, currentIndicators));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    } else if (e.key === "Enter" && results.length > 0) {
      select(results[0].ticker);
    }
  }

  return (
    <div className="relative">
      {/* Symbol badge + input — badge hidden when no symbol is loaded */}
      <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-md px-3 py-1.5 w-56 focus-within:border-gray-600 transition-colors">
        {currentSymbol && (
          <>
            <span className="text-xs font-mono font-semibold text-white shrink-0">
              {currentSymbol}
            </span>
            <span className="text-gray-700 text-xs shrink-0">/</span>
          </>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={currentSymbol ? "Search…" : "Search for a symbol…"}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none min-w-0"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 border border-gray-800 rounded-md shadow-xl z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-500">No results</p>
          ) : (
            <ul>
              {results.map((s) => (
                <li key={s.ticker}>
                  <button
                    type="button"
                    onMouseDown={() => select(s.ticker)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-xs font-mono font-semibold text-white w-14 shrink-0">
                      {s.ticker}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
