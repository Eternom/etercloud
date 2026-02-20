import { HardDrive, Zap, ShieldCheck, Globe } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pillars = [
  {
    icon: Zap,
    title: "Speed",
    description: "Your server is online within seconds of payment confirmation. No waiting, no queue.",
  },
  {
    icon: ShieldCheck,
    title: "Isolation",
    description: "Every server runs in its own container. Your resources and data are yours alone.",
  },
  {
    icon: Globe,
    title: "Simplicity",
    description: "No terminal, no config files. Everything happens through a clean dashboard.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero header ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex flex-1 flex-col gap-4">
            <span className="inline-block w-fit rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">About</span>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Game server hosting,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">simplified</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              EterCloud is a hosting platform built for players who want their server online in seconds — without any technical setup.
            </p>
          </div>
          <div className="hidden shrink-0 lg:flex">
            <div className="relative flex size-36 items-center justify-center rounded-3xl bg-card shadow-2xl ring-1 ring-border">
              <div className="absolute -top-4 -right-4 size-10 rounded-full bg-secondary/20 blur-xl" />
              <div className="absolute -bottom-6 -left-6 size-16 rounded-full bg-primary/20 blur-2xl" />
              <HardDrive className="relative size-16 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Pillars ── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Our values</span>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built on three pillars</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <Card key={p.title} className="group overflow-hidden border-none bg-card shadow-xl shadow-muted/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <CardHeader className="pb-2 pt-8">
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${i % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} group-hover:bg-primary group-hover:text-white transition-colors`}>
                  <p.icon className="size-7" />
                </div>
                <CardTitle className="text-xl font-bold">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-muted-foreground leading-relaxed">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Details ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">What is EterCloud?</span>
            <h2 className="text-2xl font-bold tracking-tight">One platform, zero friction</h2>
            <p className="leading-relaxed text-muted-foreground">
              EterCloud is a game server hosting platform. Subscribe to a monthly plan, and we automatically provision a dedicated game server for you — powered by Pterodactyl.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Technology</span>
            <h2 className="text-2xl font-bold tracking-tight">Powered by Pterodactyl</h2>
            <p className="leading-relaxed text-muted-foreground">
              Every server runs in its own isolated container on top of Pterodactyl — an open-source game server management panel trusted by thousands of hosting providers worldwide.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
