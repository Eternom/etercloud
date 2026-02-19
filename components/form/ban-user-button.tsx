"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Ban } from "lucide-react"

interface BanUserButtonProps {
  userId: string
}

export function BanUserButton({ userId }: BanUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBan = async () => {
    const reason = prompt("Ban reason:")
    if (!reason) return

    setIsLoading(true)
    try {
      await authClient.admin.banUser({
        userId,
        banReason: reason,
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to ban user:", error)
      alert("Failed to ban user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleBan}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : <Ban className="h-4 w-4" />}
    </Button>
  )
}
