import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const locations = await prisma.location.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  })

  return NextResponse.json(locations)
}
