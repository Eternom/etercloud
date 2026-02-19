export const dynamic = "force-dynamic"

import Link from "next/link"
import { HardDrive } from "lucide-react"
import { pteroFetch } from "@/lib/pterodactyl"
import stripe from "@/lib/stripe"
import type { PteroList, PteroNode } from "@/types/pterodactyl"
import { cn } from "@/lib/utils"

type ServiceStatus = "operational" | "maintenance" | "unavailable"

const statusConfig: Record<ServiceStatus, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-green-500", text: "text-green-500" },
  maintenance: { label: "Maintenance", dot: "bg-yellow-500", text: "text-yellow-500" },
  unavailable: { label: "Unavailable", dot: "bg-red-500", text: "text-red-500" },
}

interface NodeResult {
  id: number
  name: string
  fqdn: string
  status: ServiceStatus
}

interface PanelResult {
  status: ServiceStatus
  nodes: NodeResult[]
}

async function checkPanel(): Promise<PanelResult> {
  try {
    const data = await pteroFetch<PteroList<PteroNode>>("/nodes")
    const nodes = data.data.map((d) => d.attributes)
    return {
      status: "operational",
      nodes: nodes.map((n) => ({
        id: n.id,
        name: n.name,
        fqdn: n.fqdn,
        status: n.maintenance_mode ? "maintenance" : "operational",
      })),
    }
  } catch {
    return { status: "unavailable", nodes: [] }
  }
}

async function checkPayment(): Promise<ServiceStatus> {
  try {
    await stripe.balance.retrieve()
    return "operational"
  } catch {
    return "unavailable"
  }
}

function StatusRow({
  name,
  description,
  status,
}: {
  name: string
  description?: string
  status: ServiceStatus
}) {
  const config = statusConfig[status]
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-medium">{name}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("flex items-center gap-1.5 text-sm font-medium", config.text)}>
        <span className={cn("size-2 rounded-full", config.dot)} />
        {config.label}
      </div>
    </div>
  )
}

export default async function StatusPage() {
  const [panelResult, paymentStatus] = await Promise.all([
    checkPanel(),
    checkPayment(),
  ])

  const allStatuses: ServiceStatus[] = [
    panelResult.status,
    paymentStatus,
    ...panelResult.nodes.map((n) => n.status),
  ]

  const overallStatus: ServiceStatus =
    allStatuses.some((s) => s === "unavailable")
      ? "unavailable"
      : allStatuses.some((s) => s === "maintenance")
        ? "maintenance"
        : "operational"

  const overallMessage = {
    operational: "All systems operational",
    maintenance: "Partial outage — maintenance in progress",
    unavailable: "Service disruption detected",
  }[overallStatus]

  const overallColors = {
    operational: "border-green-500/20 bg-green-500/5 text-green-500",
    maintenance: "border-yellow-500/20 bg-yellow-500/5 text-yellow-500",
    unavailable: "border-red-500/20 bg-red-500/5 text-red-500",
  }[overallStatus]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <HardDrive className="size-4" />
            EterCloud
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="mt-2 text-muted-foreground">Real-time status of EterCloud infrastructure.</p>
        </div>

        <div className={cn("mb-10 rounded-xl border px-6 py-5 text-center", overallColors)}>
          <p className="text-base font-semibold">{overallMessage}</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Services</h2>
          <div className="divide-y rounded-xl border">
            <StatusRow name="Game Panel" description="Pterodactyl control panel" status={panelResult.status} />
            <StatusRow name="Payment System" description="Stripe billing infrastructure" status={paymentStatus} />
          </div>
        </div>

        {panelResult.nodes.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</h2>
            <div className="divide-y rounded-xl border">
              {panelResult.nodes.map((node) => (
                <StatusRow key={node.id} name={node.name} description={node.fqdn} status={node.status} />
              ))}
            </div>
          </div>
        )}

        {panelResult.nodes.length === 0 && panelResult.status === "unavailable" && (
          <div className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</h2>
            <p className="text-sm text-muted-foreground">Node data unavailable — panel is unreachable.</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Last checked:{" "}
          {new Date().toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "UTC",
          })}{" "}
          UTC
        </p>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <HardDrive className="size-4" />
            EterCloud
          </div>
          <p>Game server hosting, simplified.</p>
          <div className="flex gap-4">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <Link href="/login" className="transition-colors hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
