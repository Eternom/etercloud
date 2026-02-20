"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SyncAllGameCategoriesButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSync() {
    setLoading(true)
    await fetch("/api/admin/sync/game-categories", { method: "POST" })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleSync} disabled={loading}>
      <RefreshCw className="mr-2 size-4" />
      {loading ? "Syncing..." : "Sync all"}
    </Button>
  )
}
