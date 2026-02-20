"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SyncGameCategoryButtonProps {
  nestId: number
  eggId: number
  name: string
  description: string
  dockerImage: string
  startup: string
}

export function SyncGameCategoryButton({
  nestId,
  eggId,
  name,
  description,
  dockerImage,
  startup,
}: SyncGameCategoryButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSync() {
    setLoading(true)
    await fetch("/api/admin/game-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nestId, eggId, name, description, dockerImage, startup }),
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
