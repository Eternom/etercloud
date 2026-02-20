"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BillingButtonProps {
  planId?: string
  isLoggedIn: boolean
  hasSubscription: boolean
  className?: string
  children: React.ReactNode
}

export function BillingButton({
  planId,
  isLoggedIn,
  hasSubscription,
  className,
  children,
}: BillingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction() {
    if (!isLoggedIn) {
      router.push("/signup")
      return
    }

    setLoading(true)
    try {
      const endpoint = hasSubscription ? "/api/billing/portal" : "/api/billing/checkout"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: !hasSubscription && planId ? JSON.stringify({ planId }) : undefined,
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        console.error("Billing error:", data.error)
      }
    } catch (err) {
      console.error("Billing action failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAction} disabled={loading} className={cn(className)}>
      {loading ? "Redirecting..." : children}
    </Button>
  )
}
