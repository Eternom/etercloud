'use client'

import { useState } from "react"
import { signOut } from "@/services/auth-client.service"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Sign-out button that calls BetterAuth's signOut and redirects to /login.
 *
 * @param {React.ComponentProps<typeof Button>} props - Standard Button props
 */
export function SignOutButton(props: React.ComponentProps<typeof Button>) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login"
        },
      },
    })
    setIsLoading(false)
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {props.children ?? "Sign out"}
    </Button>
  )
}
