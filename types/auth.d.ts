/**
 * Auth.js v5 type augmentation
 *
 * By default, `session.user` only includes name, email, and image.
 * We extend it to include `id` so server components can access it
 * without a separate DB lookup.
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
