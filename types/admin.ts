import type { ServerStatus } from "@/lib/prisma"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
}

export type AdminSubscription = {
  id: string
  user: { name: string; email: string }
  plan: { name: string }
  status: string
  periodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export type AdminServer = {
  id: string
  name: string
  user: { name: string; email: string }
  status: ServerStatus
  location: { name: string } | null
  gameCategory: { name: string } | null
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

export interface BanUserPayload {
  userId: string
  reason: string
  expiresAt?: Date
}

export interface UnbanUserPayload {
  userId: string
}

export interface UpdateUserRolePayload {
  userId: string
  role: "user" | "admin"
}

export interface DeleteUserPayload {
  userId: string
}

export type AdminPlan = {
  id: string
  name: string
  description: string
  stripePriceId: string
  price: number // in cents
  createdAt: Date
  planLimit: {
    cpuMax: number
    memoryMax: number
    diskMax: number
    databaseMax: number
    backupMax: number
    allocatedMax: number
    serverMax: number
  } | null
}
