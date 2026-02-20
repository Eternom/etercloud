import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

export default async function PricingPage() {
  const [session, plans] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    prisma.plan.findMany({ include: { planLimit: true }, orderBy: { price: "asc" } }),
  ])

  const isLoggedIn = !!session

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-muted-foreground">Monthly billing. No hidden fees. Cancel anytime.</p>
      </div>

      {plans.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No plans yet</EmptyTitle>
            <EmptyDescription>Plans will be available soon.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const highlighted = i === Math.floor(plans.length / 2)
            return (
              <Card
                key={plan.id}
                className={highlighted
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : "border-border/60"}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {highlighted && <Badge>Popular</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground"> / mo</span>
                  </p>
                  {plan.planLimit && (
                    <ul className="space-y-2 text-sm">
                      {[
                        { label: `${plan.planLimit.cpuMax}% CPU`, tip: "Maximum CPU allocated to your server" },
                        { label: `${plan.planLimit.memoryMax} MB RAM`, tip: "Maximum RAM available to your server" },
                        { label: `${plan.planLimit.diskMax} MB Disk`, tip: "Total disk space for your server files" },
                        { label: `${plan.planLimit.serverMax} server${plan.planLimit.serverMax > 1 ? "s" : ""}`, tip: "Number of game servers included" },
                        { label: `${plan.planLimit.backupMax} backup${plan.planLimit.backupMax > 1 ? "s" : ""}`, tip: "Maximum number of saved backups" },
                        { label: `${plan.planLimit.databaseMax} database${plan.planLimit.databaseMax > 1 ? "s" : ""}`, tip: "Number of databases available" },
                      ].map(({ label, tip }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <li className="flex cursor-default items-center gap-2 text-muted-foreground">
                              <CheckCircle2 className="size-4 shrink-0 text-primary" />
                              {label}
                            </li>
                          </TooltipTrigger>
                          <TooltipContent>{tip}</TooltipContent>
                        </Tooltip>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={highlighted ? "default" : "outline"} asChild>
                    <Link href={isLoggedIn ? "/dashboard/billing" : "/signup"}>
                      {isLoggedIn ? "Manage subscription" : "Get started"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
