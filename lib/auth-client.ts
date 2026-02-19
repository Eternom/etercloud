import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

/**
 * Client-side BetterAuth instance.
 * Provides React hooks and methods for authentication:
 * - `signIn.email()` — authenticate with email/password
 * - `signUp.email()` — register a new account
 * - `signOut()`      — revoke the current session
 * - `useSession()`   — React hook returning the current session
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient(),
  ],
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient
