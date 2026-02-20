import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"
import { BillingService } from "@/services/billing.service"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { planId } = await req.json()
  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 })
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Create Stripe customer if not already created
  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  // Block checkout if user already has an active subscription
  const existing = await BillingService.getUserSubscription(customerId)
  if (existing) {
    return NextResponse.json(
      { error: "You already have an active subscription. Use the billing portal to make changes." },
      { status: 409 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    allow_promotion_codes: true,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing/status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/billing/status?canceled=true`,
    metadata: { userId: user.id, planId: plan.id },
    subscription_data: {
      metadata: { userId: user.id, planId: plan.id },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
