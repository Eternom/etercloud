import Stripe from "stripe"

// Lazy initialization via Proxy — defers `new Stripe(...)` to the first property
// access at request time, so the Docker build succeeds without STRIPE_SECRET_KEY.
let _client: Stripe | null = null

function getClient(): Stripe {
  if (!_client) {
    _client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    })
  }
  return _client
}

const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getClient() as never as Record<string | symbol, unknown>)[prop]
  },
})

export default stripe