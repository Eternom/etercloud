"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SyncLocationButtonProps {
  pteroId: number
  name: string
  description: string
}

export function SyncLocationButton({ pteroId, name, description }: SyncLocationButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSync() {
    setLoading(true)
    await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pteroId, name, description }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button size="sm" variant="outline" onClick={handleSync} disabled={loading}>
      {loading ? "Syncing..." : "Sync"}
    </Button>
  )
}
