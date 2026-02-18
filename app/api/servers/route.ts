import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ptero } from "@/services/pterodactyl"
import { getOrCreatePteroUserId } from "@/services/user"

function requiredEnv(name: string): number {
  const val = process.env[name]
  if (!val) throw new Error(`${name} environment variable is not set`)
  const num = parseInt(val, 10)
  if (isNaN(num)) throw new Error(`${name} must be a number`)
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
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    include: { plan: { include: { planLimit: true } } },
  })

  if (!subscription || subscription.status !== "active") {
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

  // Get env config
  const locationId = requiredEnv("PTERODACTYL_LOCATION_ID")
  const nestId = requiredEnv("PTERODACTYL_NEST_ID")
  const eggId = requiredEnv("PTERODACTYL_EGG_ID")

  // Get egg with variables to build the environment map
  const egg = await ptero.getEggWithVariables(nestId, eggId)
  const environment = Object.fromEntries(
    egg.variables.map((v) => [v.env_variable, v.default_value]),
  )

  // Get or create Pterodactyl user account
  const pteroUserId = await getOrCreatePteroUserId(session.user.id)

  // Create server on Pterodactyl
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

  // Save server to DB
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
}
