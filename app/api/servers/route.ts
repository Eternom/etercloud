import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { ptero } from "@/services/pterodactyl.service"
import { getOrCreatePteroUserId } from "@/services/user.service"
import { createServerSchema } from "@/helpers/validations/server"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Require an active subscription first (needed for limit-aware Zod schema)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  const subscription = await BillingService.getUserSubscription(user?.stripeCustomerId ?? null)

  if (!subscription) {
    return NextResponse.json({ error: "An active subscription is required" }, { status: 403 })
  }

  const limit = subscription.plan.planLimit
  if (!limit) {
    return NextResponse.json({ error: "Plan has no resource limits configured" }, { status: 500 })
  }

  // Calculate already-used resources across active servers
  const used = await prisma.server.aggregate({
    where: { userId: session.user.id, status: { not: "terminated" } },
    _sum: {
      memoryUsage: true,
      cpuUsage: true,
      diskUsage: true,
      databaseUsage: true,
      backupUsage: true,
      allocatedUsage: true,
    },
  })

  const remaining = {
    memoryMax: limit.memoryMax - (used._sum.memoryUsage ?? 0),
    cpuMax: limit.cpuMax - (used._sum.cpuUsage ?? 0),
    diskMax: limit.diskMax - (used._sum.diskUsage ?? 0),
    databaseMax: limit.databaseMax - (used._sum.databaseUsage ?? 0),
    backupMax: limit.backupMax - (used._sum.backupUsage ?? 0),
    allocatedMax: limit.allocatedMax - (used._sum.allocatedUsage ?? 0),
  }

  // Validate body with Zod schema built from remaining (not raw plan limits)
  const parsed = createServerSchema(remaining).safeParse(await req.json())

  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid request"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, locationId, gameCategoryId, memory, cpu, disk, databases, backups, allocations } = parsed.data

  // Check server count against plan limit
  const serverCount = await prisma.server.count({
    where: { userId: session.user.id, status: { not: "terminated" } },
  })

  if (serverCount >= limit.serverMax) {
    return NextResponse.json(
      { error: `Your plan allows a maximum of ${limit.serverMax} server${limit.serverMax > 1 ? "s" : ""}` },
      { status: 403 },
    )
  }

  try {
    // Resolve location and game category from DB
    const [location, gameCategory] = await Promise.all([
      prisma.location.findUnique({ where: { id: locationId, active: true } }),
      prisma.gameCategory.findUnique({ where: { id: gameCategoryId, active: true } }),
    ])

    if (!location) {
      return NextResponse.json({ error: "Selected location is not available" }, { status: 400 })
    }
    if (!gameCategory) {
      return NextResponse.json({ error: "Selected game category is not available" }, { status: 400 })
    }

    // Fetch egg variables for environment defaults
    const egg = await ptero.getEggWithVariables(gameCategory.pteroNestId, gameCategory.pteroEggId)
    const environment = Object.fromEntries(
      egg.variables.map((v) => [v.env_variable, v.default_value]),
    )

    const pteroUserId = await getOrCreatePteroUserId(session.user.id)

    const pteroServer = await ptero.createServer({
      name: name.trim(),
      userId: pteroUserId,
      eggId: gameCategory.pteroEggId,
      dockerImage: gameCategory.dockerImage,
      startupCommand: gameCategory.startup,
      environment,
      limits: {
        memory,
        swap: 0,
        disk,
        io: 500,
        cpu,
      },
      featureLimits: {
        databases,
        backups,
        allocations,
      },
      deploy: { locations: [location.pteroId] },
    })

    const server = await prisma.server.create({
      data: {
        name: pteroServer.name,
        identifierPtero: pteroServer.identifier,
        idPtero: String(pteroServer.id),
        status: "active",
        cpuUsage: cpu,
        memoryUsage: memory,
        diskUsage: disk,
        databaseUsage: databases,
        backupUsage: backups,
        allocatedUsage: allocations,
        userId: session.user.id,
        locationId: location.id,
        gameCategoryId: gameCategory.id,
      },
    })

    return NextResponse.json(server, { status: 201 })
  } catch (err) {
    console.error("Server creation failed:", err)
    const message = err instanceof Error ? err.message : "Server creation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
