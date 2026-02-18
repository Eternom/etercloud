import { headers } from "next/headers"
import { Server } from "lucide-react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ServerCard } from "@/components/display/server-card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default async function ServersPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const servers = await prisma.server.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Servers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your game servers.
        </p>
      </div>

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
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Server />
            </EmptyMedia>
            <EmptyTitle>No servers</EmptyTitle>
            <EmptyDescription>
              Your servers will appear here once created.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
