/**
 * lib/observability.ts — Error monitoring and event capture stub
 *
 * Phase 0: Logs to console in dev, no-ops in production.
 * To wire up Sentry:
 *   1. npm install @sentry/nextjs
 *   2. Run `npx @sentry/wizard@latest -i nextjs` to generate sentry.*.config.ts
 *   3. Set SENTRY_DSN in your environment
 *   4. Replace the TODO comments below with real Sentry calls
 *
 * All application code should use these functions rather than calling
 * Sentry directly, so we can swap the vendor without touching call sites.
 */

type ErrorContext = Record<string, unknown>;
type EventProperties = Record<string, unknown>;

export function captureError(error: unknown, context?: ErrorContext): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[observability] captureError:", error, context ?? "");
    return;
  }
  // TODO: Sentry.captureException(error, { extra: context });
  console.error("[observability] captureError:", error);
}

export function captureMessage(
  message: string,
  context?: EventProperties
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[observability] captureMessage:", message, context ?? "");
    return;
  }
  // TODO: Sentry.captureMessage(message, { extra: context });
}

export function setUser(userId: string | null): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[observability] setUser:", userId);
    return;
  }
  // TODO: Sentry.setUser(userId ? { id: userId } : null);
}
