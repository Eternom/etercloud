/**
 * Client-side auth service.
 * Centralizes all BetterAuth client methods — import from here instead of @/lib/auth-client.
 */
export {
  authClient,
  signIn,
  signOut,
  signUp,
  useSession,
} from "@/lib/auth-client"

export { authClient as default } from "@/lib/auth-client"
