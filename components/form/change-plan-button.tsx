"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ChangePlanButtonProps {
  planId: string
  label: string
}

export function ChangePlanButton({ planId, label }: ChangePlanButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    try {
      await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleClick} disabled={loading}>
      {loading ? "Switching..." : label}
    </Button>
  )
}
