import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") return null
  return session
}

// PATCH /api/admin/locations/[id]
// Toggles the active field of a synced location.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { active } = await req.json() as {
    active?: boolean
  }

  const location = await prisma.location.update({
    where: { id },
    data: {
      ...(active !== undefined && { active }),
    },
  })

  return NextResponse.json(location)
}
