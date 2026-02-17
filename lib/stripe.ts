import Stripe from "stripe"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover", 
})

export default stripeClient