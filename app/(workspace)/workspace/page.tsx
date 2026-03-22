import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Workspace",
};

// Sidebar nav items — labels map to Phase roadmap.
// Links are placeholders; real routes will be added per phase.
const NAV_ITEMS = [
  { label: "Charts", phase: "Phase 1", href: "#" },
  { label: "Scanner", phase: "Phase 2", href: "#" },
  { label: "Watchlists", phase: "Phase 2", href: "#" },
  { label: "Alerts", phase: "Phase 4", href: "#" },
  { label: "Journal", phase: "Phase 5", href: "#" },
] as const;

export default async function WorkspacePage() {
  const session = await auth();

  // Belt-and-suspenders: middleware handles the redirect, but guard
  // here as well in case middleware config changes.
  if (!session?.user) {
    redirect("/sign-in");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside className="w-60 flex flex-col border-r border-gray-800 shrink-0">
        {/* Wordmark */}
        <div className="h-14 px-5 flex items-center border-b border-gray-800">
          <span className="text-base font-semibold text-white tracking-tight">
            Klairo
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Modules
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ label, phase }) => (
              <li key={label}>
                <span className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-gray-500 select-none">
                  <span>{label}</span>
                  <span className="text-[10px] text-gray-700 font-mono">
                    {phase}
                  </span>
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
              <p className="text-[11px] text-gray-600 truncate">
                {session.user.email}
              </p>
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

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 px-6 flex items-center border-b border-gray-800 shrink-0">
          <p className="text-sm text-gray-400">
            Welcome back
            {session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </p>
        </header>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
              <ChartIcon />
            </div>
            <h2 className="text-base font-medium text-gray-200 mb-1">
              Your workspace is ready
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Charting, scanner, alerts, and journal are being built.
              <br />
              Check back as each phase ships.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChartIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.5l5-5 4 4 5-6 4 3.5"
      />
    </svg>
  );
}
