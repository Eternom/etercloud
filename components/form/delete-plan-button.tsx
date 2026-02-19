"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DeletePlanButtonProps {
  planId: string
  planName: string
}

export function DeletePlanButton({ planId, planName }: DeletePlanButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/admin/plans/${planId}`, { method: "DELETE" })
      router.refresh()
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Confirm"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </span>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      onClick={() => setConfirming(true)}
      title={`Delete plan "${planName}"`}
    >
      Delete
    </Button>
  )
}
