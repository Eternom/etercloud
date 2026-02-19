import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { planId } = await req.json() as { planId: string }
  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 })
  }

  const [subscription, newPlan] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.plan.findUnique({ where: { id: planId } }),
  ])

  if (!subscription || subscription.status !== "active") {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 })
  }

  if (!newPlan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  if (subscription.planId === planId) {
    return NextResponse.json({ error: "Already on this plan" }, { status: 400 })
  }

  // Retrieve the current Stripe subscription to get the item ID
  const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
  const itemId = stripeSub.items.data[0]?.id

  if (!itemId) {
    return NextResponse.json({ error: "Stripe subscription item not found" }, { status: 500 })
  }

  // Update the subscription price in Stripe (proration applied automatically)
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [{ id: itemId, price: newPlan.stripePriceId }],
    proration_behavior: "create_prorations",
  })

  // Sync the plan change to DB (webhook will also confirm)
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { planId: newPlan.id },
  })

  return NextResponse.json({ success: true })
}
