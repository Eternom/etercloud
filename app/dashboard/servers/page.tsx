import { headers } from "next/headers"
import { Server } from "lucide-react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ServerCard } from "@/components/display/server-card"
import { CreateServerForm } from "@/components/form/create-server-form"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default async function ServersPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const [servers, subscription] = await Promise.all([
    prisma.server.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.findUnique({
      where: { userId: session!.user.id },
      include: { plan: { include: { planLimit: true } } },
    }),
  ])

  const hasActiveSub = subscription?.status === "active"
  const serverMax = subscription?.plan.planLimit?.serverMax ?? 0
  const activeCount = servers.filter((s) => s.status !== "terminated").length
  const atLimit = activeCount >= serverMax

  let disabledReason: string | undefined
  if (!hasActiveSub) disabledReason = "An active subscription is required"
  else if (atLimit) disabledReason = `Your plan allows a maximum of ${serverMax} server${serverMax > 1 ? "s" : ""}`

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your game servers.
          </p>
        </div>
        <CreateServerForm
          disabled={!hasActiveSub || atLimit}
          disabledReason={disabledReason}
        />
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
              {hasActiveSub
                ? "Create your first server to get started."
                : "Subscribe to a plan to create your first server."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
