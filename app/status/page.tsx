export const dynamic = "force-dynamic"

import Link from "next/link"
import { HardDrive, Server, CreditCard } from "lucide-react"
import { pteroFetch } from "@/lib/pterodactyl"
import stripe from "@/lib/stripe"
import type { PteroList, PteroNode } from "@/types/pterodactyl"
import { cn } from "@/lib/utils"
import { NodeStatusGrid } from "@/components/display/node-status-grid"
import type { NodeStatus, NodeResult } from "@/components/display/node-status-grid"

type ServiceStatus = "operational" | "maintenance" | "unavailable"

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; dot: string; text: string; banner: string }
> = {
  operational: {
    label: "Operational",
    dot: "bg-green-500",
    text: "text-green-500",
    banner: "border-green-500/20 bg-green-500/5 text-green-500",
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-yellow-500",
    text: "text-yellow-500",
    banner: "border-yellow-500/20 bg-yellow-500/5 text-yellow-500",
  },
  unavailable: {
    label: "Unavailable",
    dot: "bg-red-500",
    text: "text-red-500",
    banner: "border-red-500/20 bg-red-500/5 text-red-500",
  },
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
        status: (n.maintenance_mode ? "maintenance" : "operational") as NodeStatus,
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

function StatusDot({ status, size = "sm" }: { status: ServiceStatus; size?: "sm" | "md" }) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === "md" ? "size-3" : "size-2"
  return (
    <span className={cn("relative flex shrink-0", sizeClass)}>
      {status === "operational" && (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            config.dot,
          )}
        />
      )}
      <span className={cn("relative inline-flex rounded-full", sizeClass, config.dot)} />
    </span>
  )
}

function ServiceCard({
  name,
  description,
  icon: Icon,
  status,
}: {
  name: string
  description: string
  icon: React.ElementType
  status: ServiceStatus
}) {
  const config = STATUS_CONFIG[status]
  return (
    <div className="flex items-start justify-between rounded-xl border p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={cn("flex shrink-0 items-center gap-1.5 text-xs font-medium", config.text)}>
        <StatusDot status={status} />
        {config.label}
      </div>
    </div>
  )
}

export default async function StatusPage() {
  const [panelResult, paymentStatus] = await Promise.all([checkPanel(), checkPayment()])

  const allStatuses: ServiceStatus[] = [
    panelResult.status,
    paymentStatus,
    ...panelResult.nodes.map((n) => n.status as ServiceStatus),
  ]

  const overallStatus: ServiceStatus = allStatuses.some((s) => s === "unavailable")
    ? "unavailable"
    : allStatuses.some((s) => s === "maintenance")
      ? "maintenance"
      : "operational"

  const overallMessage = {
    operational: "All systems operational",
    maintenance: "Partial outage — maintenance in progress",
    unavailable: "Service disruption detected",
  }[overallStatus]

  const operationalCount = allStatuses.filter((s) => s === "operational").length

  const checkedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <HardDrive className="size-4" />
            EterCloud
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="mt-1 text-muted-foreground">
            Real-time status of EterCloud infrastructure.
          </p>
        </div>

        {/* Overall banner */}
        <div
          className={cn(
            "mb-10 flex items-center gap-4 rounded-2xl border px-6 py-5",
            STATUS_CONFIG[overallStatus].banner,
          )}
        >
          <StatusDot status={overallStatus} size="md" />
          <div className="flex-1">
            <p className="font-semibold">{overallMessage}</p>
            <p className="text-xs opacity-70">
              {operationalCount} of {allStatuses.length} component
              {allStatuses.length !== 1 ? "s" : ""} operational
            </p>
          </div>
          <p className="shrink-0 text-xs opacity-60">{checkedAt} UTC</p>
        </div>

        {/* Services */}
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Services
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ServiceCard
              name="Game Panel"
              description="Pterodactyl control panel"
              icon={Server}
              status={panelResult.status}
            />
            <ServiceCard
              name="Payment System"
              description="Stripe billing infrastructure"
              icon={CreditCard}
              status={paymentStatus}
            />
          </div>
        </section>

        {/* Nodes */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nodes
            </h2>
            {panelResult.nodes.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {panelResult.nodes.length} node{panelResult.nodes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {panelResult.nodes.length > 0 ? (
            <NodeStatusGrid nodes={panelResult.nodes} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {panelResult.status === "unavailable"
                ? "Node data unavailable — panel is unreachable."
                : "No nodes configured."}
            </p>
          )}
        </section>
      </main>

      <footer className="mt-16 border-t bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <HardDrive className="size-4" />
            EterCloud
          </div>
          <p>Game server hosting, simplified.</p>
          <div className="flex gap-4">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
