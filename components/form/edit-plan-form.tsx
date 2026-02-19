"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AdminPlan } from "@/types/admin"

interface EditPlanFormProps {
  plan: AdminPlan
}

export function EditPlanForm({ plan }: EditPlanFormProps) {
  const [fields, setFields] = useState({
    name: plan.name,
    description: plan.description,
    price: (plan.price / 100).toFixed(2),
    cpuMax: String(plan.planLimit?.cpuMax ?? ""),
    memoryMax: String(plan.planLimit?.memoryMax ?? ""),
    diskMax: String(plan.planLimit?.diskMax ?? ""),
    databaseMax: String(plan.planLimit?.databaseMax ?? ""),
    backupMax: String(plan.planLimit?.backupMax ?? ""),
    allocatedMax: String(plan.planLimit?.allocatedMax ?? ""),
    serverMax: String(plan.planLimit?.serverMax ?? ""),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
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
        setError(data.error ?? "Failed to update plan")
        return
      }
      router.push("/admin/plans")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={fields.name} onChange={set("name")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="price">Price (€/mo)</Label>
          <Input id="price" type="number" min="0" step="0.01" value={fields.price} onChange={set("price")} required />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={fields.description} onChange={set("description")} required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cpuMax">CPU max (%)</Label>
          <Input id="cpuMax" type="number" min="0" value={fields.cpuMax} onChange={set("cpuMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="memoryMax">Memory max (MB)</Label>
          <Input id="memoryMax" type="number" min="0" value={fields.memoryMax} onChange={set("memoryMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="diskMax">Disk max (MB)</Label>
          <Input id="diskMax" type="number" min="0" value={fields.diskMax} onChange={set("diskMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="databaseMax">Databases max</Label>
          <Input id="databaseMax" type="number" min="0" value={fields.databaseMax} onChange={set("databaseMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="backupMax">Backups max</Label>
          <Input id="backupMax" type="number" min="0" value={fields.backupMax} onChange={set("backupMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="allocatedMax">Allocations max</Label>
          <Input id="allocatedMax" type="number" min="0" value={fields.allocatedMax} onChange={set("allocatedMax")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="serverMax">Servers max</Label>
          <Input id="serverMax" type="number" min="0" value={fields.serverMax} onChange={set("serverMax")} required />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/plans")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
