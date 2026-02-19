import type { User, SubscriptionStatus, ServerStatus } from "@/lib/prisma"

export type AdminUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "banned" | "banReason" | "banExpires" | "createdAt"
>

export type AdminSubscription = {
  id: string
  user: { name: string; email: string }
  plan: { name: string }
  status: SubscriptionStatus
  periodEnd: Date
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
