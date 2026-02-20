import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { BillingButton } from "@/components/form/billing-button"
import { PageHeader } from "@/components/display/page-header"
import { ExternalLink } from "lucide-react"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { stripeCustomerId: true },
  })

  const subscription = await BillingService.getUserSubscription(user?.stripeCustomerId ?? null)

  const periodEnd = subscription?.latestInvoice
    ? new Date(subscription.latestInvoice.period_end * 1000)
    : null

  return (
    <>
      <PageHeader title="Billing" description="Manage your subscription and plan." />
      <div className="flex flex-col gap-8 p-8 max-w-3xl">
        {subscription ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Current plan</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{subscription.plan.name}</CardTitle>
                  <Badge variant={subscription.stripeSubscription.status === "active" ? "default" : "secondary"}>
                    {subscription.stripeSubscription.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription>{subscription.plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-2xl font-bold">
                  {formatPrice(subscription.plan.price)}
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </p>
                {subscription.plan.planLimit && (
                  <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                    <li>{subscription.plan.planLimit.cpuMax}% CPU</li>
                    <li>{subscription.plan.planLimit.memoryMax} MB RAM</li>
                    <li>{subscription.plan.planLimit.diskMax} MB Disk</li>
                    <li>Up to {subscription.plan.planLimit.serverMax} server{subscription.plan.planLimit.serverMax > 1 ? "s" : ""}</li>
                  </ul>
                )}
                <Separator />
                {periodEnd && (
                  <p className="text-sm text-muted-foreground">
                    {subscription.stripeSubscription.cancel_at_period_end
                      ? `Cancels on ${formatDate(periodEnd)}`
                      : `Renews on ${formatDate(periodEnd)}`}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <BillingButton
                  isLoggedIn={true}
                  hasSubscription={true}
                  className="w-full"
                >
                  Manage with Stripe <ExternalLink className="ml-2 h-4 w-4" />
                </BillingButton>
              </CardFooter>
            </Card>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">No active subscription</h2>
            <Card>
              <CardHeader>
                <CardTitle>Subscription required</CardTitle>
                <CardDescription>
                  You have not chosen a plan yet. Head to the pricing page to select a plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Billing is handled securely via Stripe. Once you pick a plan you will be redirected
                to Stripe Checkout to complete your subscription — promo codes are supported.
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/pricing">View plans</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        )}
      </div>
    </>
  )
}
