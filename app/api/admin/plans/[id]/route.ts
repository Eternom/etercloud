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

// PATCH /api/admin/plans/[id]
// Updates plan fields. If price changed, archives the old Stripe price and creates a new one.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
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

  const existing = await prisma.plan.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  // Retrieve the Stripe price to get the product ID
  const existingPrice = await stripe.prices.retrieve(existing.stripePriceId)
  const productId = typeof existingPrice.product === "string"
    ? existingPrice.product
    : existingPrice.product.id

  // Update Stripe product name/description
  await stripe.products.update(productId, {
    name: body.name,
    description: body.description,
  })

  let stripePriceId = existing.stripePriceId

  // If price changed, archive old price and create a new one
  if (body.price !== existing.price) {
    await stripe.prices.update(existing.stripePriceId, { active: false })

    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: body.price,
      currency: "eur",
      recurring: { interval: "month" },
    })
    stripePriceId = newPrice.id
  }

  const plan = await prisma.plan.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      stripePriceId,
      planLimit: {
        update: {
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

  return NextResponse.json(plan)
}

// DELETE /api/admin/plans/[id]
// Archives the Stripe product + price and deletes the plan from DB.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.plan.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  // Archive Stripe price and product (Stripe doesn't allow deletion if used)
  const price = await stripe.prices.retrieve(existing.stripePriceId)
  await stripe.prices.update(existing.stripePriceId, { active: false })
  await stripe.products.update(
    typeof price.product === "string" ? price.product : price.product.id,
    { active: false },
  )

  await prisma.plan.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
