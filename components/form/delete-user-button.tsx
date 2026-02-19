"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface DeleteUserButtonProps {
  userId: string
  userName: string
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      await authClient.admin.removeUser({ userId })
      router.refresh()
    } catch (error) {
      console.error("Failed to delete user:", error)
      alert("Failed to delete user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
