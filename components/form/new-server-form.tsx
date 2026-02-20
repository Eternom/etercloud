"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { createServerSchema, type CreateServerData, type PlanLimits } from "@/helpers/validations/server"

interface Option {
  id: string
  name: string
  description: string | null
}

interface NewServerFormProps {
  locations: Option[]
  categories: Option[]
  limits: PlanLimits
}

function mbToGb(mb: number) {
  return (mb / 1024).toFixed(1)
}

export function NewServerForm({ locations, categories, limits }: NewServerFormProps) {
  const router = useRouter()
  const schema = createServerSchema(limits)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateServerData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      memory: Math.max(128, limits.memoryMax),
      cpu: Math.max(10, limits.cpuMax),
      disk: Math.max(512, limits.diskMax),
      databases: Math.max(0, limits.databaseMax),
      backups: Math.max(0, limits.backupMax),
      allocations: Math.max(1, limits.allocatedMax),
    },
  })

  async function onSubmit(data: CreateServerData) {
    const res = await fetch("/api/servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError("root", { message: body?.error ?? "Failed to create server" })
      return
    }
    router.push("/dashboard/servers")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* ── General ── */}
      <Field>
        <FieldLabel htmlFor="name">Server name</FieldLabel>
        <Input
          id="name"
          placeholder="My server"
          autoFocus
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </Field>

      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <Controller
          name="locationId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.locationId?.message} />
      </Field>

      <Field>
        <FieldLabel htmlFor="game">Game</FieldLabel>
        <Controller
          name="gameCategoryId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="game">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.gameCategoryId?.message} />
      </Field>

      {/* ── Resources ── */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="memory">RAM (MB)</FieldLabel>
          <Input id="memory" type="number" min={128} max={limits.memoryMax} {...register("memory")} />
          <FieldDescription>{mbToGb(limits.memoryMax)} GB remaining</FieldDescription>
          <FieldError message={errors.memory?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="cpu">CPU (%)</FieldLabel>
          <Input id="cpu" type="number" min={10} max={limits.cpuMax} {...register("cpu")} />
          <FieldDescription>{limits.cpuMax}% remaining</FieldDescription>
          <FieldError message={errors.cpu?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="disk">Disk (MB)</FieldLabel>
          <Input id="disk" type="number" min={512} max={limits.diskMax} {...register("disk")} />
          <FieldDescription>{mbToGb(limits.diskMax)} GB remaining</FieldDescription>
          <FieldError message={errors.disk?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="allocations">Allocations</FieldLabel>
          <Input id="allocations" type="number" min={1} max={limits.allocatedMax} {...register("allocations")} />
          <FieldDescription>{limits.allocatedMax} remaining</FieldDescription>
          <FieldError message={errors.allocations?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="databases">Databases</FieldLabel>
          <Input id="databases" type="number" min={0} max={limits.databaseMax} {...register("databases")} />
          <FieldDescription>{limits.databaseMax} remaining</FieldDescription>
          <FieldError message={errors.databases?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="backups">Backups</FieldLabel>
          <Input id="backups" type="number" min={0} max={limits.backupMax} {...register("backups")} />
          <FieldDescription>{limits.backupMax} remaining</FieldDescription>
          <FieldError message={errors.backups?.message} />
        </Field>
      </div>

      {errors.root?.message && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create server"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/servers")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
