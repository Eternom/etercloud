"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/services/auth-client.service"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

interface UnbanUserButtonProps {
  userId: string
}

export function UnbanUserButton({ userId }: UnbanUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUnban = async () => {
    setIsLoading(true)
    try {
      await authClient.admin.unbanUser({ userId })
      router.refresh()
    } catch (error) {
      console.error("Failed to unban user:", error)
      alert("Failed to unban user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleUnban}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : <CheckCircle className="h-4 w-4" />}
    </Button>
  )
}
