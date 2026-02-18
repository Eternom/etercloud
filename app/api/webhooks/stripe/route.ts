import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import stripeClient from "@/lib/stripe"
import prisma from "@/lib/prisma"
import type { SubscriptionStatus } from "@/lib/prisma"

function toSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  const map: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    unpaid: "unpaid",
    paused: "canceled",
  }
  return map[status] ?? "canceled"
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription
  if (!sub) return null
  return typeof sub === "string" ? sub : sub.id
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripeClient.webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== "subscription") break

      const userId = session.metadata?.userId
      const planId = session.metadata?.planId
      const subscriptionId = session.subscription as string
      const invoiceId = session.invoice as string

      if (!userId || !planId || !subscriptionId || !invoiceId) break

      const [sub, invoice, plan] = await Promise.all([
        stripeClient.subscriptions.retrieve(subscriptionId),
        stripeClient.invoices.retrieve(invoiceId),
        prisma.plan.findUnique({ where: { id: planId } }),
      ])
      if (!plan) break

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          planId,
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0].price.id,
          status: toSubscriptionStatus(sub.status),
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
        update: {
          planId,
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0].price.id,
          status: toSubscriptionStatus(sub.status),
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      })
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = subscriptionIdFromInvoice(invoice)
      if (!subscriptionId) break

      const sub = await stripeClient.subscriptions.retrieve(subscriptionId)

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: toSubscriptionStatus(sub.status),
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const planId = sub.metadata?.planId

      // Get period from the latest invoice
      const latestInvoiceId = typeof sub.latest_invoice === "string"
        ? sub.latest_invoice
        : sub.latest_invoice?.id

      let periodData: { periodStart: Date; periodEnd: Date } | null = null
      if (latestInvoiceId) {
        const invoice = await stripeClient.invoices.retrieve(latestInvoiceId)
        periodData = {
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
        }
      }

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: toSubscriptionStatus(sub.status),
          stripePriceId: sub.items.data[0].price.id,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          ...(planId ? { planId } : {}),
          ...(periodData ?? {}),
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "canceled" },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
