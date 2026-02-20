import { headers } from "next/headers"
import { Server, Activity, Cpu, MemoryStick } from "lucide-react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { StatCard } from "@/components/display/stat-card"
import { ServerCard } from "@/components/display/server-card"
import { PageHeader } from "@/components/display/page-header"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const servers = await prisma.server.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  })

  const totalServers = servers.length
  const activeServers = servers.filter((s) => s.status === "active").length
  const totalCpu = servers.reduce((sum, s) => sum + s.cpuUsage, 0)
  const totalRam = servers.reduce((sum, s) => sum + s.memoryUsage, 0)

  return (
    <>
      <PageHeader title="Overview" description="Welcome to your EterCloud dashboard." />
      <div className="flex flex-col gap-8 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total servers"
            value={totalServers}
            icon={Server}
          />
          <StatCard
            title="Active servers"
            value={activeServers}
            icon={Activity}
          />
          <StatCard
            title="CPU usage"
            value={totalServers > 0 ? `${totalCpu}%` : "—"}
            description="Combined across all your servers"
            icon={Cpu}
          />
          <StatCard
            title="RAM usage"
            value={totalServers > 0 ? `${(totalRam / 1024).toFixed(1)} GB` : "—"}
            description="Combined across all your servers"
            icon={MemoryStick}
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Your servers</h2>
          {servers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {servers.map((server) => (
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
