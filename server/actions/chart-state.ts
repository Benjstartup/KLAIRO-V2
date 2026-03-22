"use server";

// Minimal chart state persistence.
// URL params always take priority; these are only used to restore defaults on cold load.

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveLastSymbol(symbol: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const existing = await db.workspace.findUnique({ where: { userId: session.user.id } });
  const prev = (existing?.settings as Record<string, unknown>) ?? {};
  await db.workspace.upsert({
    where: { userId: session.user.id },
    update: { settings: { ...prev, lastSymbol: symbol } },
    create: { userId: session.user.id, name: "Default", settings: { lastSymbol: symbol } },
  });
}

export async function saveChartPreferences(
  timeframe: string,
  indicators: string[],
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await db.userPreferences.upsert({
    where: { userId: session.user.id },
    update: { defaultTimeframe: timeframe, defaultIndicators: indicators },
    create: {
      userId: session.user.id,
      defaultTimeframe: timeframe,
      defaultIndicators: indicators,
    },
  });
}
