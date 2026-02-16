import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * BetterAuth catch-all route handler.
 * Exposes the following endpoints under `/api/auth/`:
 *
 * POST /api/auth/sign-up/email  - Register a new user (name, email, password)
 * POST /api/auth/sign-in/email  - Authenticate with email and password
 * POST /api/auth/sign-out       - Revoke the current session
 * GET  /api/auth/get-session    - Return the current user session
 */
export const { POST, GET } = toNextJsHandler(auth);