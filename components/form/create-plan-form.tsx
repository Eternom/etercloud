"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreatePlanFormProps {
  onCreated?: () => void
}

const defaultValues = {
  name: "",
  description: "",
  price: "",
  cpuMax: "",
  memoryMax: "",
  diskMax: "",
  databaseMax: "",
  backupMax: "",
  allocatedMax: "",
  serverMax: "",
}

export function CreatePlanForm({ onCreated }: CreatePlanFormProps) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(defaultValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function set(key: keyof typeof defaultValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          description: fields.description,
          price: Math.round(parseFloat(fields.price) * 100),
          cpuMax: parseInt(fields.cpuMax),
          memoryMax: parseInt(fields.memoryMax),
          diskMax: parseInt(fields.diskMax),
          databaseMax: parseInt(fields.databaseMax),
          backupMax: parseInt(fields.backupMax),
          allocatedMax: parseInt(fields.allocatedMax),
          serverMax: parseInt(fields.serverMax),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to create plan")
        return
      }
      setFields(defaultValues)
      setOpen(false)
      onCreated?.()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>Create plan</Button>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>New plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={fields.name} onChange={set("name")} required placeholder="Starter" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (€/mo)</Label>
              <Input id="price" type="number" min="0" step="0.01" value={fields.price} onChange={set("price")} required placeholder="9.99" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={fields.description} onChange={set("description")} required placeholder="Entry-level plan for small servers" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="cpuMax">CPU max (%)</Label>
              <Input id="cpuMax" type="number" min="0" value={fields.cpuMax} onChange={set("cpuMax")} required placeholder="100" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="memoryMax">Memory max (MB)</Label>
              <Input id="memoryMax" type="number" min="0" value={fields.memoryMax} onChange={set("memoryMax")} required placeholder="1024" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="diskMax">Disk max (MB)</Label>
              <Input id="diskMax" type="number" min="0" value={fields.diskMax} onChange={set("diskMax")} required placeholder="10240" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="databaseMax">Databases max</Label>
              <Input id="databaseMax" type="number" min="0" value={fields.databaseMax} onChange={set("databaseMax")} required placeholder="2" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="backupMax">Backups max</Label>
              <Input id="backupMax" type="number" min="0" value={fields.backupMax} onChange={set("backupMax")} required placeholder="2" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="allocatedMax">Allocations max</Label>
              <Input id="allocatedMax" type="number" min="0" value={fields.allocatedMax} onChange={set("allocatedMax")} required placeholder="1" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="serverMax">Servers max</Label>
              <Input id="serverMax" type="number" min="0" value={fields.serverMax} onChange={set("serverMax")} required placeholder="1" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create plan"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setOpen(false); setFields(defaultValues); setError(null) }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
