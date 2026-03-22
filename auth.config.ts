/**
 * auth.config.ts — Edge-safe auth configuration
 *
 * This file contains ONLY the parts of the Auth.js config that are safe
 * to run in the Next.js Edge runtime (middleware). It must NOT import:
 *   - Prisma or any other Node.js-only library
 *   - lib/db.ts
 *
 * lib/auth.ts spreads this config and adds the Prisma adapter on top,
 * for use in Server Components and API routes (Node.js runtime only).
 *
 * See: https://authjs.dev/guides/edge-compatibility
 */

import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  // Explicitly set JWT strategy so that both this thin config (middleware)
  // and the full config in lib/auth.ts (which adds the Prisma adapter) use
  // the same session mechanism. Without this, the Prisma adapter causes
  // lib/auth.ts to default to database sessions while the middleware
  // (which has no adapter) defaults to JWT — producing a session mismatch
  // and an "Invalid Compact JWE" error after OAuth callback.
  //
  // With JWT strategy: sessions live in a signed cookie; the Prisma adapter
  // still persists User and Account rows, but the Session table is unused.
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    // Runs in middleware on every matched request.
    // Returning false → redirect to signIn page.
    // Returning true → allow request through.
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
