import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscribeButton } from "@/components/form/subscribe-button"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const [subscription, plans] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId: session!.user.id },
      include: { plan: true },
    }),
    prisma.plan.findMany({
      include: { planLimit: true },
      orderBy: { price: "asc" },
    }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      {subscription ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Current subscription</h2>
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
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on ${formatDate(subscription.periodEnd)}`
                  : `Renews on ${formatDate(subscription.periodEnd)}`}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Available plans</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${(plan.price / 100).toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground"> / month</span>
                  </p>
                  {plan.planLimit && (
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
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
        </div>
      )}
    </div>
  )
}
