import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(users)
}
