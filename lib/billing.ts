/**
 * lib/billing.ts — Billing and subscription stub
 *
 * Phase 0: Returns free-tier stubs. No Stripe calls yet.
 * To wire up Stripe:
 *   1. npm install stripe
 *   2. Set STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
 *      and STRIPE_WEBHOOK_SECRET in your environment
 *   3. Create products and price IDs in the Stripe dashboard
 *   4. Replace the TODO comments below with real Stripe SDK calls
 *   5. Add a webhook handler at app/api/billing/webhook/route.ts
 *
 * All billing logic must remain server-side. Never expose the Stripe
 * secret key to the client.
 */

export type BillingPlan = "free" | "pro";

export interface SubscriptionStatus {
  plan: BillingPlan;
  status: "active" | "trialing" | "canceled" | "none";
  currentPeriodEnd?: Date;
}

/**
 * Returns the current subscription status for a user.
 * Phase 0: always returns free tier.
 */
export async function getSubscription(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string
): Promise<SubscriptionStatus> {
  // TODO: Query Stripe for the customer's subscription via userId -> stripeCustomerId
  return { plan: "free", status: "none" };
}

/**
 * Creates a Stripe Checkout session and returns the redirect URL.
 * Phase 0: throws — call only after wiring up Stripe.
 */
export async function createCheckoutSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  plan: BillingPlan
): Promise<string> {
  // TODO: stripe.checkout.sessions.create({ ... })
  throw new Error(
    "Billing is not yet configured. Set STRIPE_SECRET_KEY to enable."
  );
}

/**
 * Creates a Stripe Customer Portal session for plan management.
 * Phase 0: throws — call only after wiring up Stripe.
 */
export async function createPortalSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string
): Promise<string> {
  // TODO: stripe.billingPortal.sessions.create({ ... })
  throw new Error(
    "Billing is not yet configured. Set STRIPE_SECRET_KEY to enable."
  );
}
