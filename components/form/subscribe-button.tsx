"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SubscribeButtonProps {
  planId: string
}

export function SubscribeButton({ planId }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSubscribe} disabled={loading}>
      {loading ? "Redirecting..." : "Subscribe"}
    </Button>
  )
}
