/**
 * Auth.js v5 — catch-all API route
 * Handles all /api/auth/* requests: sign-in, sign-out, callbacks, etc.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
