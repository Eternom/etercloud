export const dynamic = 'force-dynamic'

import Link from "next/link"
import {
  Zap, CreditCard, MapPin, ShieldCheck,
  BarChart3, HardDrive, CheckCircle2, ArrowRight,
} from "lucide-react"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

const features = [
  {
    icon: Zap,
    title: "Instant provisioning",
    description: "Your server is deployed automatically the moment your payment is confirmed — no waiting, no manual setup.",
  },
  {
    icon: CreditCard,
    title: "Flexible billing",
    description: "Monthly subscriptions with no lock-in. Upgrade, downgrade, or cancel at any time from your dashboard.",
  },
  {
    icon: MapPin,
    title: "Multiple locations",
    description: "Choose the deployment region closest to your players for the lowest latency possible.",
  },
  {
    icon: ShieldCheck,
    title: "Isolated environments",
    description: "Each server runs in its own isolated container — your data and resources are never shared with other users.",
  },
  {
    icon: BarChart3,
    title: "Resource monitoring",
    description: "Track CPU, RAM, and disk usage in real time directly from your dashboard.",
  },
  {
    icon: HardDrive,
    title: "Backup support",
    description: "Create and restore backups of your server at any time. Your world is always safe.",
  },
]

const steps = [
  { number: "01", title: "Create an account", description: "Sign up in seconds with your email address." },
  { number: "02", title: "Choose a plan", description: "Pick the plan that fits your needs and complete the checkout via Stripe." },
  { number: "03", title: "Your server is live", description: "Your game server is automatically provisioned and ready to connect." },
]

const faq = [
  {
    question: "What is EterCloud?",
    answer: "EterCloud is a game server hosting platform. You subscribe to a monthly plan, and we automatically provision a dedicated game server for you — powered by Pterodactyl.",
  },
  {
    question: "How quickly is my server deployed?",
    answer: "Your server is provisioned automatically as soon as your Stripe payment is confirmed, usually within a few seconds.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes. You can upgrade or downgrade your plan at any time from the Billing page. The price difference is prorated automatically by Stripe.",
  },
  {
    question: "What happens if I cancel?",
    answer: "Your subscription is cancelled at the end of the current billing period. Your server remains accessible until then.",
  },
  {
    question: "Which games are supported?",
    answer: "The supported games depend on which game categories are available on your region. Check the Games section on this page for the current list.",
  },
]

export default async function HomePage() {
  const [session, plans, locations, games] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    prisma.plan.findMany({ include: { planLimit: true }, orderBy: { price: "asc" } }),
    prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.gameCategory.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ])

  const isLoggedIn = !!session

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:py-40">
        {/* Brand — mobile only (replaces hidden top navbar) */}
        <div className="flex items-center gap-2 text-xl font-bold md:hidden">
          <HardDrive className="size-5" />
          EterCloud
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Zap className="size-3" />
          Instantly deployed game servers
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your game server,{" "}
          <span className="text-primary">online in seconds</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Subscribe to a plan, pay monthly, and get a fully configured game server deployed automatically — no technical knowledge required.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            {isLoggedIn ? (
              <Link href="/dashboard">
                Go to dashboard <ArrowRight className="ml-2 size-4" />
              </Link>
            ) : (
              <Link href="/signup">
                Get started <ArrowRight className="ml-2 size-4" />
              </Link>
            )}
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#pricing">See pricing</a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mt-2 text-muted-foreground">Built for players, designed for simplicity.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── How it works ── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-2 text-muted-foreground">Three steps to get your server online.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1">
              <span className="text-5xl font-bold text-primary/20">{step.number}</span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Pricing ── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-2 text-muted-foreground">Monthly billing. No hidden fees. Cancel anytime.</p>
        </div>

        {plans.length === 0 ? (
          <p className="text-center text-muted-foreground">Plans coming soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const highlighted = i === Math.floor(plans.length / 2)
              return (
                <Card
                  key={plan.id}
                  className={highlighted ? "border-primary shadow-lg ring-1 ring-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" : "border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"}
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
                      <Link href="/signup">Get started</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <Separator />

      {/* ── Locations ── */}
      {locations.length > 0 && (
        <>
          <section id="locations" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Deployment regions</h2>
              <p className="mt-2 text-muted-foreground">Choose the location closest to your players for the lowest latency.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc) => (
                <Card
                  key={loc.id}
                  className="group flex items-center gap-4 px-6 py-5 border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                    <span className="absolute inset-0 rounded-xl animate-ping bg-primary/15" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm leading-snug">{loc.name}</p>
                    {loc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{loc.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* ── Games ── */}
      {games.length > 0 && (
        <>
          <section id="games" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Supported games</h2>
              <p className="mt-2 text-muted-foreground">Ready-to-deploy game templates, no configuration needed.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {games.map((game) => (
                <Badge key={game.id} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {game.name}
                </Badge>
              ))}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to launch your server?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Create an account, pick a plan, and your server will be online in seconds.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Create an account <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
