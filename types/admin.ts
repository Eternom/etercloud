import type { User } from "@/lib/prisma"

export type AdminUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "banned" | "banReason" | "banExpires" | "createdAt"
>

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
