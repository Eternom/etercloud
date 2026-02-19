import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ptero } from "@/services/pterodactyl.service"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") return null
  return session
}

// GET /api/admin/locations
// Returns Pterodactyl locations merged with local DB locations.
export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [pteroLocations, dbLocations] = await Promise.all([
    ptero.listLocations(),
    prisma.location.findMany({
      include: { _count: { select: { servers: true } } },
    }),
  ])

  const dbByPteroId = new Map(dbLocations.map((l) => [l.pteroId, l]))

  const merged = pteroLocations.map((pl) => {
    const db = dbByPteroId.get(pl.id)
    return {
      pteroId: pl.id,
      name: pl.short,
      description: pl.long,
      synced: !!db,
      dbId: db?.id ?? null,
      active: db?.active ?? false,
      serverCount: db?._count.servers ?? 0,
    }
  })

  return NextResponse.json(merged)
}

// POST /api/admin/locations
// Syncs a Pterodactyl location to the local DB.
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { pteroId, name, description } = body as {
    pteroId: number
    name: string
    description: string
  }

  const location = await prisma.location.upsert({
    where: { pteroId },
    create: { pteroId, name, description, active: true },
    update: { name, description },
  })

  return NextResponse.json(location, { status: 201 })
}
