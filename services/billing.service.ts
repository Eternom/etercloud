import stripe from "@/lib/stripe"
import prisma from "@/lib/prisma"
import type Stripe from "stripe"

export type UserSubscription = {
  stripeSubscription: Stripe.Subscription
  latestInvoice: Stripe.Invoice | null
  plan: {
    id: string
    name: string
    description: string
    price: number
    stripePriceId: string
    planLimit: {
      cpuMax: number
      memoryMax: number
      diskMax: number
      databaseMax: number
      backupMax: number
      allocatedMax: number
      serverMax: number
    } | null
  }
}

export type AdminSubscription = {
  id: string
  user: { name: string; email: string }
  plan: { name: string }
  status: string
  periodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export class BillingService {
  /**
   * Returns the user's active or trialing Stripe subscription + matched DB Plan.
   * Returns null if the user has no stripeCustomerId or no active subscription.
   * Fetches up to 10 subscriptions to handle edge cases (e.g. duplicate subs from old system).
   */
  static async getUserSubscription(
    stripeCustomerId: string | null
  ): Promise<UserSubscription | null> {
    if (!stripeCustomerId) return null

    const result = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
      expand: ["data.latest_invoice"],
    })

    // Pick the first active or trialing subscription (Stripe returns newest first)
    const sub = result.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    )
    if (!sub) return null

    const priceId = sub.items.data[0]?.price.id
    if (!priceId) return null

    const plan = await prisma.plan.findFirst({
      where: { stripePriceId: priceId },
      include: { planLimit: true },
    })
    if (!plan) return null

    const latestInvoice =
      sub.latest_invoice && typeof sub.latest_invoice === "object"
        ? (sub.latest_invoice as Stripe.Invoice)
        : null

    return { stripeSubscription: sub, latestInvoice, plan }
  }

  /**
   * Returns all platform subscriptions from Stripe, joined with DB users and plans.
   * Used by the admin subscriptions page.
   */
  static async listAllSubscriptions(): Promise<AdminSubscription[]> {
    const [stripeResult, users, plans] = await Promise.all([
      stripe.subscriptions.list({ limit: 100, expand: ["data.latest_invoice"] }),
      prisma.user.findMany({
        select: { name: true, email: true, stripeCustomerId: true },
      }),
      prisma.plan.findMany({
        select: { name: true, stripePriceId: true },
      }),
    ])

    const userByCustomerId = new Map(
      users
        .filter((u) => u.stripeCustomerId)
        .map((u) => [u.stripeCustomerId!, u])
    )
    const planByPriceId = new Map(plans.map((p) => [p.stripePriceId, p]))

    return stripeResult.data.map((sub) => {
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id
      const user = userByCustomerId.get(customerId)
      const priceId = sub.items.data[0]?.price.id
      const plan = priceId ? planByPriceId.get(priceId) : undefined

      const latestInvoice =
        sub.latest_invoice && typeof sub.latest_invoice === "object"
          ? (sub.latest_invoice as Stripe.Invoice)
          : null

      return {
        id: sub.id,
        user: user
          ? { name: user.name, email: user.email }
          : { name: "Unknown", email: "Unknown" },
        plan: plan ? { name: plan.name } : { name: "Unknown" },
        status: sub.status,
        periodEnd: latestInvoice ? new Date(latestInvoice.period_end * 1000) : null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      }
    })
  }
}
