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

// GET /api/admin/game-categories
// Returns Pterodactyl eggs (across all nests) merged with local DB game categories.
export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [nests, dbCategories] = await Promise.all([
    ptero.listNests(),
    prisma.gameCategory.findMany({
      include: { _count: { select: { servers: true } } },
    }),
  ])

  const dbByEggId = new Map(dbCategories.map((c) => [c.pteroEggId, c]))

  const eggsPerNest = await Promise.all(
    nests.map(async (nest) => {
      const eggs = await ptero.listEggs(nest.id)
      return eggs.map((egg) => {
        const db = dbByEggId.get(egg.id)
        return {
          nestId: nest.id,
          nestName: nest.name,
          eggId: egg.id,
          name: egg.name,
          description: egg.description ?? "",
          dockerImage: egg.docker_image,
          startup: egg.startup,
          synced: !!db,
          dbId: db?.id ?? null,
          active: db?.active ?? false,
          serverCount: db?._count.servers ?? 0,
        }
      })
    }),
  )

  return NextResponse.json(eggsPerNest.flat())
}

// POST /api/admin/game-categories
// Syncs a Pterodactyl egg as a GameCategory in the local DB.
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as {
    nestId: number
    eggId: number
    name: string
    description: string
    dockerImage: string
    startup: string
  }

  const category = await prisma.gameCategory.upsert({
    where: { pteroEggId: body.eggId },
    create: {
      name: body.name,
      description: body.description,
      pteroNestId: body.nestId,
      pteroEggId: body.eggId,
      dockerImage: body.dockerImage,
      startup: body.startup,
      active: true,
    },
    update: {
      name: body.name,
      description: body.description,
      dockerImage: body.dockerImage,
      startup: body.startup,
    },
  })

  return NextResponse.json(category, { status: 201 })
}
