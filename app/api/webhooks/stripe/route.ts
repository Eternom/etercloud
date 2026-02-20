import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import stripeClient from "@/lib/stripe"

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
      // TODO: provision server after successful checkout
      break
    }

    case "invoice.paid": {
      // TODO: handle renewal (e.g. ensure server is unsuspended)
      break
    }

    case "customer.subscription.updated": {
      // TODO: handle plan change or cancellation scheduling
      break
    }

    case "customer.subscription.deleted": {
      // TODO: suspend or delete user's server on subscription cancellation
      break
    }
  }

  return NextResponse.json({ received: true })
}
