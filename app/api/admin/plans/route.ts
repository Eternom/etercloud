import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") return null
  return session
}

// GET /api/admin/plans
export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const plans = await prisma.plan.findMany({
    include: { planLimit: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(plans)
}

// POST /api/admin/plans
// Creates a Stripe product + price, then saves Plan + PlanLimit to DB.
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as {
    name: string
    description: string
    price: number // in cents
    cpuMax: number
    memoryMax: number
    diskMax: number
    databaseMax: number
    backupMax: number
    allocatedMax: number
    serverMax: number
  }

  // 1. Create Stripe product
  const product = await stripe.products.create({
    name: body.name,
    description: body.description,
  })

  // 2. Create Stripe price on that product
  const stripePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: body.price,
    currency: "eur",
    recurring: { interval: "month" },
  })

  // 3. Create Plan + PlanLimit in DB
  const plan = await prisma.plan.create({
    data: {
      name: body.name,
      description: body.description,
      stripePriceId: stripePrice.id,
      price: body.price,
      planLimit: {
        create: {
          cpuMax: body.cpuMax,
          memoryMax: body.memoryMax,
          diskMax: body.diskMax,
          databaseMax: body.databaseMax,
          backupMax: body.backupMax,
          allocatedMax: body.allocatedMax,
          serverMax: body.serverMax,
        },
      },
    },
    include: { planLimit: true },
  })

  return NextResponse.json(plan, { status: 201 })
}
