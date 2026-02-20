import { z } from "zod"

export interface PlanLimits {
  memoryMax: number
  cpuMax: number
  diskMax: number
  databaseMax: number
  backupMax: number
  allocatedMax: number
}

export function createServerSchema(limits: PlanLimits) {
  return z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(64, "Name must be 64 characters or less"),
    locationId: z.string().min(1, "Location is required"),
    gameCategoryId: z.string().min(1, "Game is required"),
    memory: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(128, "Minimum 128 MB")
      .max(limits.memoryMax, `Maximum ${limits.memoryMax} MB`),
    cpu: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(10, "Minimum 10%")
      .max(limits.cpuMax, `Maximum ${limits.cpuMax}%`),
    disk: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(512, "Minimum 512 MB")
      .max(limits.diskMax, `Maximum ${limits.diskMax} MB`),
    databases: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(0)
      .max(limits.databaseMax, `Maximum ${limits.databaseMax}`),
    backups: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(0)
      .max(limits.backupMax, `Maximum ${limits.backupMax}`),
    allocations: z.coerce
      .number({ message: "Must be a number" })
      .int("Must be a whole number")
      .min(1, "At least 1 allocation")
      .max(limits.allocatedMax, `Maximum ${limits.allocatedMax}`),
  })
}

export type CreateServerData = z.infer<ReturnType<typeof createServerSchema>>
