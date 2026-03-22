/**
 * lib/analytics.ts — Product analytics stub
 *
 * Phase 0: Logs to console in dev, no-ops in production.
 * To wire up PostHog:
 *   1. npm install posthog-js posthog-node
 *   2. Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST in your environment
 *   3. Add a PostHog provider to app/layout.tsx
 *   4. Replace the TODO comments below with real PostHog calls
 *
 * Keep server-side and client-side analytics calls in separate utilities
 * if needed (posthog-node for server, posthog-js for client).
 *
 * This file is safe to import from server components.
 */

type EventProperties = Record<string, unknown>;

export function trackEvent(event: string, properties?: EventProperties): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics] trackEvent:", event, properties ?? "");
    return;
  }
  // TODO: posthog.capture(event, properties);
}

export function identifyUser(
  userId: string,
  traits?: EventProperties
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics] identifyUser:", userId, traits ?? "");
    return;
  }
  // TODO: posthog.identify(userId, traits);
}

export function resetUser(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics] resetUser");
    return;
  }
  // TODO: posthog.reset();
}
