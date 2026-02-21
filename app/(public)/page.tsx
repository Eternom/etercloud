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
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

const features = [
  {
    icon: Zap,
    title: "Instant provisioning",
    description: "Your server is deployed automatically the moment your payment is confirmed — no waiting, no manual setup.",
    image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=800",
  },
  {
    icon: CreditCard,
    title: "Flexible billing",
    description: "Monthly subscriptions with no lock-in. Upgrade, downgrade, or cancel at any time from your dashboard.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
  },
  {
    icon: MapPin,
    title: "Multiple locations",
    description: "Choose the deployment region closest to your players for the lowest latency possible.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800",
  },
  {
    icon: ShieldCheck,
    title: "Isolated environments",
    description: "Each server runs in its own isolated container — your data and resources are never shared with other users.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
  },
  {
    icon: BarChart3,
    title: "Resource monitoring",
    description: "Track CPU, RAM, and disk usage in real time directly from your dashboard.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    icon: HardDrive,
    title: "Backup support",
    description: "Create and restore backups of your server at any time. Your world is always safe.",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800",
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
      <section className="relative mx-auto flex max-w-6xl flex-col gap-12 overflow-hidden px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:py-32">
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

        {/* Left: text content */}
        <div className="relative flex flex-1 flex-col items-center text-center gap-8 lg:items-start lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <span className="inline-block w-fit rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Next-Gen Game Hosting
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              Your game server, <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                online in seconds
              </span>
            </h1>
          </div>

          <p className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Subscribe to a professional plan and get a fully configured game server deployed automatically. No technical knowledge required, just play.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="rounded-full px-8 py-7 text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  Go to dashboard <ArrowRight className="ml-2 size-5" />
                </Link>
              ) : (
                <Link href="/signup">
                  Get started now <ArrowRight className="ml-2 size-5" />
                </Link>
              )}
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 py-7 text-lg transition-transform hover:scale-105">
              <a href="#pricing">View Plans</a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-3" />
              </div>
              No setup fees
            </span>
            <span className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-3" />
              </div>
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-3" />
              </div>
              24/7 Support
            </span>
          </div>
        </div>

        {/* Right: decorative visual — Vela Style */}
        <div className="relative flex flex-1 items-center justify-center lg:justify-end">
          <div className="relative h-80 w-80 sm:h-96 sm:w-96">
            {/* Main Decorative Circle */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 rotate-6 animate-pulse" />
            <div className="absolute inset-0 overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-border">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"
                alt="Gaming background"
                className="h-full w-full object-cover opacity-20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-30"
              />
            </div>
            
            {/* "Illustration" Elements */}
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-8">
              <div className="flex size-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-transform duration-500 hover:scale-110">
                <HardDrive className="size-12" />
              </div>
              
              <div className="w-full space-y-3">
                <div className="h-2 w-3/4 rounded-full bg-muted" />
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-1/2 rounded-full bg-muted" />
              </div>
              
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-2">
                  <div className="size-8 rounded-full bg-green-400/20" />
                  <div className="size-8 rounded-full bg-primary/20" />
                </div>
                <div className="h-10 w-24 rounded-full bg-secondary/10 border border-secondary/20" />
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -left-8 top-12 animate-bounce duration-[3000ms] hidden sm:flex">
              <div className="flex items-center gap-2 rounded-2xl bg-card p-3 shadow-xl ring-1 ring-border">
                <div className="size-8 rounded-lg bg-green-500 flex items-center justify-center text-white">
                  <Zap className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase">Active</span>
                  <span className="text-[10px] text-muted-foreground">Server live</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-12 animate-bounce duration-[4000ms] hidden sm:flex">
              <div className="flex items-center gap-2 rounded-2xl bg-card p-3 shadow-xl ring-1 ring-border">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase">99.9%</span>
                  <span className="text-[10px] text-muted-foreground">Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Features ── */}
      <section id="features" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        {/* Mobile: carousel */}
        <div className="sm:hidden -mx-4">
          <Carousel opts={{ align: "start" }} className="w-full px-4">
            <CarouselContent className="-ml-3">
              {features.map((f, i) => (
                <CarouselItem key={f.title} className="pl-3 basis-[85%]">
                  <Card className="group overflow-hidden border-none bg-card shadow-xl shadow-muted/20 h-full">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={f.image} alt={f.title} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <div className={cn("absolute bottom-4 left-6 flex size-12 items-center justify-center rounded-2xl shadow-lg", i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                        <f.icon className="size-6" />
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-6"><CardTitle className="text-xl font-bold">{f.title}</CardTitle></CardHeader>
                    <CardContent className="pb-8"><p className="text-muted-foreground leading-relaxed">{f.description}</p></CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={f.title} className="group overflow-hidden border-none bg-card shadow-xl shadow-muted/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className={cn(
                  "absolute bottom-4 left-6 flex size-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                  i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}>
                  <f.icon className="size-6" />
                </div>
              </div>
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── How it works ── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Three steps to go live</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">From sign-up to playing in under a minute.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center gap-4 text-center">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                {step.number}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Pricing ── */}
      <section id="pricing" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Pricing</span>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Monthly billing. No hidden fees. Cancel anytime.</p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground font-medium">Plans coming soon. Stay tuned!</p>
          </div>
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
                             <p className="font-bold text-lg">Ready to play?</p>
                             <p className="text-sm text-muted-foreground leading-relaxed">Subscribe now and get your server deployed in less than 60 seconds.</p>
                           </div>
                           <Button asChild className="w-full rounded-full py-7 text-lg font-black shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]">
                             <Link href="/signup">Get started now <ArrowRight className="ml-2 size-5" /></Link>
                           </Button>
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

      <Separator />

      {/* ── Locations ── */}
      {locations.length > 0 && (
        <>
          <section id="locations" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Locations</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Deployment regions</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Choose the location closest to your players for the lowest latency.</p>
            </div>
            {/* Mobile: carousel */}
            <div className="sm:hidden -mx-4">
              <Carousel opts={{ align: "start" }} className="w-full px-4">
                <CarouselContent className="-ml-3">
                  {locations.map((loc, i) => (
                    <CarouselItem key={loc.id} className="pl-3 basis-[85%]">
                      <Card className="group relative flex flex-col gap-4 overflow-hidden border-none bg-card p-8 shadow-xl shadow-muted/20 h-full">
                        <img src={`https://images.unsplash.com/photo-${["1512453979798-5ea266f8880c","1449824913935-59a10b8d2000","1444723121867-7a241cacace9","1502602898657-3e91760cbb34","1518391846015-55a9cc003b25"][i % 5]}?auto=format&fit=crop&q=80&w=800`} alt={loc.name} className="absolute inset-0 h-full w-full object-cover opacity-5" />
                        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <MapPin className="size-7" />
                          <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/15" />
                        </div>
                        <div className="relative flex flex-col gap-2">
                          <p className="text-xl font-bold">{loc.name}</p>
                          {loc.description && <p className="text-muted-foreground leading-relaxed">{loc.description}</p>}
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            {/* Desktop: grid */}
            <div className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc, i) => (
                <Card
                  key={loc.id}
                  className="group relative flex flex-col gap-4 overflow-hidden border-none bg-card p-8 shadow-xl shadow-muted/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${[
                      "1512453979798-5ea266f8880c",
                      "1449824913935-59a10b8d2000",
                      "1444723121867-7a241cacace9",
                      "1502602898657-3e91760cbb34",
                      "1518391846015-55a9cc003b25",
                    ][i % 5]}?auto=format&fit=crop&q=80&w=800`}
                    alt={loc.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-5 transition-opacity duration-300 group-hover:opacity-15"
                  />
                  <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin className="size-7" />
                    <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/15" />
                  </div>
                  <div className="relative flex flex-col gap-2">
                    <p className="text-xl font-bold">{loc.name}</p>
                    {loc.description && (
                      <p className="text-muted-foreground leading-relaxed">{loc.description}</p>
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
            <div className="mb-12 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Games</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Supported games</h2>
              <p className="mt-2 text-muted-foreground">Ready-to-deploy game templates, no configuration needed.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {games.map((game, i) => (
                <Badge key={game.id} variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:bg-secondary/80">
                  <img src={`https://images.unsplash.com/photo-${[
                    "1542751371-adc38448a05e",
                    "1511512578047-dfb367046420",
                    "1550745165-9bc0b252726f",
                    "1580234811497-9bd7fd5f3e35",
                    "1612287230202-1ff1d85d1bdf",
                  ][i % 5]}?auto=format&fit=crop&q=80&w=100`} alt="" className="size-5 rounded-md object-cover" loading="lazy" />
                  {game.name}
                </Badge>
              ))}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about our hosting platform.</p>
          </div>
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-none bg-card px-6 py-2 shadow-lg shadow-muted/10 rounded-3xl">
                  <AccordionTrigger className="text-left font-bold text-lg py-4 hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pb-6">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Final CTA ── */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary px-8 py-20 text-center text-primary-foreground shadow-2xl shadow-primary/30">
          <div className="absolute -left-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-secondary/20 blur-3xl" />
          
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
            <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
              Ready to launch your server?
            </h2>
            <p className="text-xl text-primary-foreground/80 font-medium">
              Create an account, pick a plan, and your server will be online in seconds. Join hundreds of happy gamers today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-white px-10 py-5 text-lg font-black text-primary shadow-xl transition-all hover:scale-105 active:scale-95">
                <Link href="/signup" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="size-5" />
                </Link>
              </button>
              <button className="rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/20 px-10 py-5 text-lg font-black text-white backdrop-blur-sm transition-all hover:bg-white/10">
                <Link href="/login">Sign In</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
