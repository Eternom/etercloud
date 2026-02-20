"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CreateServerFormProps {
  disabled?: boolean
  disabledReason?: string
}

export function CreateServerForm({ disabled, disabledReason }: CreateServerFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "Failed to create server")
        return
      }
      setOpen(false)
      setName("")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} disabled={disabled} title={disabledReason}>
        Create server
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Server name"
        required
        minLength={1}
        maxLength={64}
        autoFocus
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </Button>
      <Button type="button" variant="ghost" onClick={() => { setOpen(false); setName("") }}>
        Cancel
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
