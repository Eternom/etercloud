"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ToggleLocationButtonProps {
  id: string
  active: boolean
}

export function ToggleLocationButton({ id, active }: ToggleLocationButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await fetch(`/api/admin/locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant={active ? "outline" : "default"}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : active ? "Deactivate" : "Activate"}
    </Button>
  )
}
