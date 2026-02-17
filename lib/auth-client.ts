import { createAuthClient } from "better-auth/react"
import { stripeClient } from "@better-auth/stripe/client"

/**
 * Client-side BetterAuth instance.
 * Provides React hooks and methods for authentication:
 * - `signIn.email()` — authenticate with email/password
 * - `signUp.email()` — register a new account
 * - `signOut()`      — revoke the current session
 * - `useSession()`   — React hook returning the current session
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
        stripeClient({
            subscription: true
        })
    ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient