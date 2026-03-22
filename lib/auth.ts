/**
 * lib/auth.ts — Full Auth.js v5 configuration (Node.js runtime only)
 *
 * Exports: handlers (API route), auth (session getter), signIn, signOut
 *
 * This file adds the Prisma adapter on top of the Edge-safe base config
 * in auth.config.ts. It must only be imported from:
 *   - app/api/auth/[...nextauth]/route.ts
 *   - Server Components (app/ directory)
 *   - Server Actions
 *
 * Do NOT import this file from middleware.ts — use auth.config.ts there.
 *
 * Phase 0: GitHub OAuth only.
 * Phase 0+: Add email magic link or other providers in auth.config.ts.
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    ...authConfig.callbacks,
    // With JWT strategy, the session callback receives `token`, not `user`.
    // token.sub is the user's database ID — set automatically by Auth.js
    // from the User record created via the Prisma adapter on first sign-in.
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
