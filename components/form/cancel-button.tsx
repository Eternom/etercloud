"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CancelButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    if (!window.confirm("Cancel your subscription? You will keep access until the end of the billing period.")) return

    setLoading(true)
    try {
      await fetch("/api/billing/cancel", { method: "POST" })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
      {loading ? "Canceling..." : "Cancel subscription"}
    </Button>
  )
}
