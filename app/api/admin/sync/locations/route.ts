import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ptero } from "@/services/pterodactyl.service"

// TODO(#37): replace with proper admin role check once BetterAuth admin plugin is set up
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  return session
}

export async function POST() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pteroLocations = await ptero.listLocations()

  const upserted = await Promise.all(
    pteroLocations.map((loc) =>
      prisma.location.upsert({
        where: { pteroId: loc.id },
        create: {
          pteroId: loc.id,
          name: loc.short,
          description: loc.long,
          active: true,
        },
        update: {
          name: loc.short,
          description: loc.long,
        },
      }),
    ),
  )

  return NextResponse.json({ synced: upserted.length })
}
