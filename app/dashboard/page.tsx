import { headers } from "next/headers"
import { Activity, Cpu, HardDrive, MemoryStick, Server } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { StatCard } from "@/components/display/stat-card"
import { ServerCard } from "@/components/display/server-card"
import { PageHeader } from "@/components/display/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

function mbToGb(mb: number) {
  return (mb / 1024).toFixed(1)
}

function pct(used: number, max: number) {
  if (max <= 0) return 0
  return Math.min(100, Math.round((used / max) * 100))
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { stripeCustomerId: true },
  })

  const [servers, subscription] = await Promise.all([
    prisma.server.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
    }),
    BillingService.getUserSubscription(user?.stripeCustomerId ?? null),
  ])

  const activeServers = servers.filter((s) => s.status !== "terminated")
  const runningServers = servers.filter((s) => s.status === "active")

  const usedCpu = activeServers.reduce((s, sv) => s + sv.cpuUsage, 0)
  const usedRam = activeServers.reduce((s, sv) => s + sv.memoryUsage, 0)
  const usedDisk = activeServers.reduce((s, sv) => s + sv.diskUsage, 0)

  const limit = subscription?.plan.planLimit
  const serverMax = limit?.serverMax ?? 0
  const cpuMax = limit?.cpuMax ?? 0
  const ramMax = limit?.memoryMax ?? 0
  const diskMax = limit?.diskMax ?? 0

  const periodEnd = subscription
    ? new Date((subscription.stripeSubscription.items.data[0]?.current_period_end ?? 0) * 1000)
    : null

  const isCanceling = subscription?.stripeSubscription.cancel_at_period_end ?? false

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Welcome back, ${session!.user.name.split(" ")[0]}.`}
      />
      <div className="flex flex-col gap-8 p-8">

        {/* ── Plan banner ── */}
        {subscription ? (
          <div className="flex items-center justify-between rounded-xl border bg-card px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Current plan</span>
                <span className="font-semibold">{subscription.plan.name}</span>
              </div>
              <Badge variant={isCanceling ? "secondary" : "default"} className="ml-2">
                {isCanceling ? "Canceling" : subscription.stripeSubscription.status}
              </Badge>
            </div>
            {periodEnd && (
              <span className="text-sm text-muted-foreground">
                {isCanceling ? "Access ends" : "Renews"}{" "}
                <span className="font-medium text-foreground">
                  {periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-dashed px-6 py-4 text-muted-foreground">
            <span className="text-sm">No active subscription</span>
            <Link href="/dashboard/billing" className="text-sm underline underline-offset-4 hover:text-foreground">
              View plans →
            </Link>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            title="Servers"
            value={serverMax > 0 ? `${activeServers.length} / ${serverMax}` : activeServers.length}
            description="Active slots used"
            icon={Server}
          />
          <StatCard
            title="Running"
            value={runningServers.length}
            description="Servers currently active"
            icon={Activity}
          />
          <StatCard
            title="RAM allocated"
            value={usedRam > 0 ? `${mbToGb(usedRam)} GB` : "—"}
            description={ramMax > 0 ? `of ${mbToGb(ramMax)} GB` : "No plan"}
            icon={MemoryStick}
          />
          <StatCard
            title="Disk allocated"
            value={usedDisk > 0 ? `${mbToGb(usedDisk)} GB` : "—"}
            description={diskMax > 0 ? `of ${mbToGb(diskMax)} GB` : "No plan"}
            icon={HardDrive}
          />
        </div>

        {/* ── Resource usage ── */}
        {limit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resource usage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MemoryStick className="size-3.5" /> RAM
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mbToGb(usedRam)} / {mbToGb(ramMax)} GB
                  </span>
                </div>
                <Progress value={pct(usedRam, ramMax)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Cpu className="size-3.5" /> CPU
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {usedCpu} / {cpuMax}%
                  </span>
                </div>
                <Progress value={pct(usedCpu, cpuMax)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <HardDrive className="size-3.5" /> Disk
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mbToGb(usedDisk)} / {mbToGb(diskMax)} GB
                  </span>
                </div>
                <Progress value={pct(usedDisk, diskMax)} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Recent servers ── */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent servers</h2>
            {activeServers.length > 3 && (
              <Link href="/dashboard/servers" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                View all
              </Link>
            )}
          </div>
          {activeServers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeServers.slice(0, 3).map((server) => (
                <ServerCard
                  key={server.id}
                  name={server.name}
                  identifier={server.identifierPtero}
                  status={server.status}
                  cpuUsage={server.cpuUsage}
                  memoryUsageMb={server.memoryUsage}
                  diskUsageMb={server.diskUsage}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No servers yet.</p>
          )}
        </div>

      </div>
    </>
  )
}
