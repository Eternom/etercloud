import { headers } from "next/headers"
import { Server } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { ServerCard } from "@/components/display/server-card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { PageHeader } from "@/components/display/page-header"
import { Button } from "@/components/ui/button"

export default async function ServersPage() {
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

  const hasActiveSub = !!subscription
  const serverMax = subscription?.plan.planLimit?.serverMax ?? 0
  const activeCount = servers.filter((s) => s.status !== "terminated").length
  const atLimit = activeCount >= serverMax
  const canCreate = hasActiveSub && !atLimit

  return (
    <>
      <PageHeader
        title="Servers"
        description="Manage your game servers."
        action={
          canCreate ? (
            <Button asChild>
              <Link href="/dashboard/servers/new">Create server</Link>
            </Button>
          ) : null
        }
      />
      <div className="p-8">
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
    </>
  )
}
