import Link from "next/link"
import { headers } from "next/headers"
import { CreditCard, ExternalLink, Receipt, User } from "lucide-react"
import type Stripe from "stripe"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"
import { BillingService } from "@/services/billing.service"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { BillingButton } from "@/components/form/billing-button"
import { PageHeader } from "@/components/display/page-header"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

function mbToGb(mb: number) {
  return (mb / 1024).toFixed(0)
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { stripeCustomerId: true },
  })

  const [subscription, stripeCustomerRaw] = await Promise.all([
    BillingService.getUserSubscription(user?.stripeCustomerId ?? null),
    user?.stripeCustomerId
      ? stripe.customers.retrieve(user.stripeCustomerId)
      : null,
  ])

  const stripeCustomer =
    stripeCustomerRaw && !stripeCustomerRaw.deleted
      ? (stripeCustomerRaw as Stripe.Customer)
      : null

  const periodEnd = subscription
    ? new Date((subscription.stripeSubscription.items.data[0]?.current_period_end ?? 0) * 1000)
    : null

  const isCanceling = subscription?.stripeSubscription.cancel_at_period_end ?? false

  return (
    <>
      <PageHeader title="Billing" description="Manage your subscription and payment details." />

      <div className="flex gap-8 p-8">

        {/* ── Main column ── */}
        <div className="flex flex-1 flex-col gap-6 min-w-0">

          {/* Customer info */}
          {stripeCustomer && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{stripeCustomer.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer ID</span>
                  <span className="font-mono text-xs text-muted-foreground">{stripeCustomer.id}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription */}
          {subscription ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Subscription</CardTitle>
                </div>
                <CardDescription>{subscription.plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Plan + status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {formatPrice(subscription.plan.price)}
                      <span className="text-sm font-normal text-muted-foreground"> / month</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{subscription.plan.name}</p>
                  </div>
                  <Badge
                    variant={subscription.stripeSubscription.status === "active" ? "default" : "secondary"}
                  >
                    {subscription.stripeSubscription.status.replace("_", " ")}
                  </Badge>
                </div>

                <Separator />

                {/* Period */}
                {periodEnd && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isCanceling ? "Cancels on" : "Renews on"}
                    </span>
                    <span className={isCanceling ? "font-medium text-destructive" : "font-medium"}>
                      {formatDate(periodEnd)}
                    </span>
                  </div>
                )}

                {/* Plan limits */}
                {subscription.plan.planLimit && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-3 text-sm font-medium">Included resources</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">Servers</span>
                          <span className="font-medium">{subscription.plan.planLimit.serverMax}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="font-medium">{subscription.plan.planLimit.cpuMax}%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">RAM</span>
                          <span className="font-medium">{mbToGb(subscription.plan.planLimit.memoryMax)} GB</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">Disk</span>
                          <span className="font-medium">{mbToGb(subscription.plan.planLimit.diskMax)} GB</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">Databases</span>
                          <span className="font-medium">{subscription.plan.planLimit.databaseMax}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                          <span className="text-muted-foreground">Backups</span>
                          <span className="font-medium">{subscription.plan.planLimit.backupMax}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No active subscription</CardTitle>
                <CardDescription>
                  You have not chosen a plan yet. Head to the pricing page to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/pricing">View plans</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-56 shrink-0">
          {subscription ? (
            <div className="sticky top-24 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <CardTitle className="text-sm">Customer portal</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Update payment method, download invoices, or cancel your subscription.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BillingButton isLoggedIn={true} hasSubscription={true} className="w-full">
                    Open portal <ExternalLink className="ml-1.5 size-3.5" />
                  </BillingButton>
                </CardContent>
              </Card>

              {periodEnd && (
                <div className="rounded-lg border bg-card px-4 py-3 text-sm">
                  <p className="text-xs text-muted-foreground mb-1">
                    {isCanceling ? "Access ends" : "Next billing"}
                  </p>
                  <p className={`font-medium text-xs ${isCanceling ? "text-destructive" : ""}`}>
                    {formatDate(periodEnd)}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

      </div>
    </>
  )
}
