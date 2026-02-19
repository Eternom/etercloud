"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/services/auth-client.service"
import { useRouter } from "next/navigation"
import { Shield, User } from "lucide-react"
import type { AdminUser } from "@/types/admin"

interface SetRoleButtonProps {
  user: AdminUser
}

export function SetRoleButton({ user }: SetRoleButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isAdmin = user.role === "admin"

  const handleToggleRole = async () => {
    const newRole = isAdmin ? "user" : "admin"
    const confirmed = confirm(
      `Are you sure you want to ${isAdmin ? "demote" : "promote"} ${user.name} to ${newRole}?`
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      await authClient.admin.setRole({
        userId: user.id,
        role: newRole,
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update role:", error)
      alert("Failed to update role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleToggleRole}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner />
      ) : isAdmin ? (
        <User className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
    </Button>
  )
}
