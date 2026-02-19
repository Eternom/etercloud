import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubscribeButton } from "@/components/form/subscribe-button"
import { CancelButton } from "@/components/form/cancel-button"
import { ChangePlanButton } from "@/components/form/change-plan-button"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const [subscription, plans] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId: session!.user.id },
      include: { plan: { include: { planLimit: true } } },
    }),
    prisma.plan.findMany({
      include: { planLimit: true },
      orderBy: { price: "asc" },
    }),
  ])

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and plan.
        </p>
      </div>

      {subscription ? (
        <>
          {/* Current subscription */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Current plan</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{subscription.plan.name}</CardTitle>
                  <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                    {subscription.status.replace("_", " ")}
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
                <p className="text-sm text-muted-foreground">
                  {subscription.cancelAtPeriodEnd
                    ? `Cancels on ${formatDate(subscription.periodEnd)}`
                    : `Renews on ${formatDate(subscription.periodEnd)}`}
                </p>
              </CardContent>
              {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                <CardFooter>
                  <CancelButton />
                </CardFooter>
              )}
            </Card>
          </section>

          {/* Plan switching — only when active and not cancelling */}
          {subscription.status === "active" &&
            !subscription.cancelAtPeriodEnd &&
            plans.filter((p) => p.id !== subscription.planId).length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Change plan</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {plans
                  .filter((p) => p.id !== subscription.planId)
                  .map((plan) => {
                    const isUpgrade = plan.price > subscription.plan.price
                    return (
                      <Card key={plan.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                          <p className="text-xl font-bold">
                            {formatPrice(plan.price)}
                            <span className="text-sm font-normal text-muted-foreground"> / month</span>
                          </p>
                          {plan.planLimit && (
                            <ul className="space-y-0.5 text-sm text-muted-foreground">
                              <li>{plan.planLimit.cpuMax}% CPU</li>
                              <li>{plan.planLimit.memoryMax} MB RAM</li>
                              <li>{plan.planLimit.diskMax} MB Disk</li>
                              <li>Up to {plan.planLimit.serverMax} server{plan.planLimit.serverMax > 1 ? "s" : ""}</li>
                            </ul>
                          )}
                        </CardContent>
                        <CardFooter>
                          <ChangePlanButton
                            planId={plan.id}
                            label={isUpgrade ? "Upgrade" : "Downgrade"}
                          />
                        </CardFooter>
                      </Card>
                    )
                  })}
              </div>
            </section>
          )}
        </>
      ) : (
        /* No subscription — show all plans to subscribe */
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Choose a plan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-xl font-bold">
                    {formatPrice(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground"> / month</span>
                  </p>
                  {plan.planLimit && (
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      <li>{plan.planLimit.cpuMax}% CPU</li>
                      <li>{plan.planLimit.memoryMax} MB RAM</li>
                      <li>{plan.planLimit.diskMax} MB Disk</li>
                      <li>Up to {plan.planLimit.serverMax} server{plan.planLimit.serverMax > 1 ? "s" : ""}</li>
                    </ul>
                  )}
                </CardContent>
                <CardFooter>
                  <SubscribeButton planId={plan.id} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
