import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/locations
// Returns active locations available for server deployment.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const locations = await prisma.location.findMany({
    where: { active: true },
    select: { id: true, name: true, description: true },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(locations)
}
