import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { ptero } from "@/services/pterodactyl.service"
import { getOrCreatePteroUserId } from "@/services/user.service"

function requiredEnv(name: string): number {
  const val = process.env[name]
  if (!val) throw new Error(`Missing environment variable: ${name}`)
  const num = parseInt(val, 10)
  if (isNaN(num)) throw new Error(`Environment variable ${name} must be a number`)
  return num
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Server name is required" }, { status: 400 })
  }

  // Require an active subscription
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
    const locationId = requiredEnv("PTERODACTYL_LOCATION_ID")
    const nestId = requiredEnv("PTERODACTYL_NEST_ID")
    const eggId = requiredEnv("PTERODACTYL_EGG_ID")

    const egg = await ptero.getEggWithVariables(nestId, eggId)
    const environment = Object.fromEntries(
      egg.variables.map((v) => [v.env_variable, v.default_value]),
    )

    const pteroUserId = await getOrCreatePteroUserId(session.user.id)

    const pteroServer = await ptero.createServer({
      name: name.trim(),
      userId: pteroUserId,
      eggId,
      dockerImage: egg.docker_image,
      startupCommand: egg.startup,
      environment,
      limits: {
        memory: limit.memoryMax,
        swap: 0,
        disk: limit.diskMax,
        io: 500,
        cpu: limit.cpuMax,
      },
      featureLimits: {
        databases: limit.databaseMax,
        backups: limit.backupMax,
        allocations: limit.allocatedMax,
      },
      deploy: { locations: [locationId] },
    })

    const server = await prisma.server.create({
      data: {
        name: pteroServer.name,
        identifierPtero: pteroServer.identifier,
        idPtero: String(pteroServer.id),
        status: "active",
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        databaseUsage: 0,
        backupUsage: 0,
        allocatedUsage: 0,
        userId: session.user.id,
      },
    })

    return NextResponse.json(server, { status: 201 })
  } catch (err) {
    console.error("Server creation failed:", err)
    const message = err instanceof Error ? err.message : "Server creation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
