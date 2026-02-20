import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ptero } from "@/services/pterodactyl.service"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") return null
  return session
}

// POST /api/admin/sync/game-categories
// Bulk-syncs all Pterodactyl eggs into the local DB as game categories.
export async function POST() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const nests = await ptero.listNests()

  const eggsPerNest = await Promise.all(
    nests.map(async (nest) => {
      const eggs = await ptero.listEggs(nest.id)
      return eggs.map((egg) => ({ nest, egg }))
    }),
  )

  const allEggs = eggsPerNest.flat()

  await Promise.all(
    allEggs.map(({ nest, egg }) =>
      prisma.gameCategory.upsert({
        where: { pteroEggId: egg.id },
        create: {
          name: egg.name,
          description: egg.description ?? "",
          pteroNestId: nest.id,
          pteroEggId: egg.id,
          dockerImage: egg.docker_image,
          startup: egg.startup,
          active: true,
        },
        update: {
          name: egg.name,
          description: egg.description ?? "",
          dockerImage: egg.docker_image,
          startup: egg.startup,
        },
      }),
    ),
  )

  return NextResponse.json({ synced: allEggs.length })
}
