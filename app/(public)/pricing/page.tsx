import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { BillingButton } from "@/components/form/billing-button"

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

export default async function PricingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
      })
    : null

  const [plans, subscription] = await Promise.all([
    prisma.plan.findMany({ include: { planLimit: true }, orderBy: { price: "asc" } }),
    user ? BillingService.getUserSubscription(user.stripeCustomerId ?? null) : null,
  ])

  const isLoggedIn = !!session
  const hasActiveSubscription = !!subscription

  return (
    <>
      {/* ── Hero header ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col gap-4 text-center items-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Pricing</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            Simple, transparent <span className="text-primary">pricing</span>
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Monthly billing. No hidden fees. Cancel anytime. Choose the plan that fits your gaming needs.
          </p>
        </div>
      </section>

      <Separator />

      {/* ── Plans ── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        {plans.length === 0 ? (
          <Empty className="py-24 rounded-[3rem] border-2 border-dashed">
            <EmptyHeader>
              <EmptyTitle className="text-2xl font-black">No plans yet</EmptyTitle>
              <EmptyDescription className="text-lg">Plans will be available soon. Stay tuned!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="relative">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {plans.map((plan, i) => {
                const highlighted = i === Math.floor(plans.length / 2)
                return (
                  <AccordionItem
                    key={plan.id}
                    value={plan.id}
                    className={cn(
                      "group border-none bg-card px-4 py-2 shadow-xl shadow-muted/20 transition-all duration-300 rounded-[2rem] sm:px-8 sm:rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/10",
                      highlighted && "ring-2 ring-primary shadow-2xl shadow-primary/20"
                    )}
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex flex-1 flex-col items-start gap-4 pr-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black tracking-tight">{plan.name}</span>
                            {highlighted && (
                              <Badge className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium text-muted-foreground">{plan.description}</p>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black tracking-tight">{formatPrice(plan.price).split(' ')[0]}</span>
                          <span className="text-xl font-bold text-muted-foreground">€</span>
                          <span className="text-muted-foreground ml-1">/ month</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <Separator className="mb-8 opacity-20" />
                      <div className="grid gap-12 lg:grid-cols-5 lg:items-center">
                        <div className="lg:col-span-3">
                          {plan.planLimit && (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
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
                                    <div className="flex items-center gap-3 font-semibold text-foreground/90 group cursor-help transition-colors hover:text-primary">
                                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <CheckCircle2 className="size-3.5" />
                                      </div>
                                      <span className="text-sm">{label}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="rounded-xl font-medium">{tip}</TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="lg:col-span-2 flex flex-col gap-6 p-6 rounded-3xl bg-muted/30 border border-muted-foreground/10">
                           <div className="space-y-2">
                             <p className="font-bold text-lg">Ready to launch?</p>
                             <p className="text-sm text-muted-foreground leading-relaxed">
                               {isLoggedIn
                                 ? hasActiveSubscription
                                   ? "Manage or change your current subscription easily."
                                   : "Pick a plan to get started. You'll be redirected to Stripe Checkout."
                                 : "Subscribe now and get your server deployed in less than 60 seconds."}
                             </p>
                           </div>
                           <BillingButton
                             planId={plan.id}
                             isLoggedIn={isLoggedIn}
                             hasSubscription={hasActiveSubscription}
                             className="w-full rounded-full py-7 text-lg font-black shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                           >
                             {isLoggedIn
                               ? hasActiveSubscription
                                 ? "Manage subscription"
                                 : "Subscribe now"
                               : "Get started now"} <ArrowRight className="ml-2 size-5" />
                           </BillingButton>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )
      }
      </section>
    </>
  )
}
