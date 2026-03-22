/**
 * middleware.ts — Route protection (Edge runtime)
 *
 * Uses the thin auth config (auth.config.ts) which has no Prisma dependency
 * and is therefore compatible with the Next.js Edge runtime.
 *
 * The `authorized` callback in auth.config.ts controls access:
 *   - authenticated user → allow through
 *   - unauthenticated → redirect to /sign-in
 *
 * Matcher excludes:
 *   - /api/auth/* — Auth.js own OAuth callback and session endpoints
 *   - /_next/static, /_next/image — Next.js asset serving
 *   - /favicon.ico — static asset
 */

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
