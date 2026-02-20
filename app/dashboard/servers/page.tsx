import { headers } from "next/headers"
import { Plus, Server, User } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { ptero } from "@/services/pterodactyl.service"
import { ServerCard } from "@/components/display/server-card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/display/page-header"
import { Button } from "@/components/ui/button"

export default async function ServersPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { stripeCustomerId: true, pterodactylUserId: true },
  })

  const [servers, subscription, pteroUser] = await Promise.all([
    prisma.server.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
    }),
    BillingService.getUserSubscription(user?.stripeCustomerId ?? null),
    user?.pterodactylUserId ? ptero.getUser(user.pterodactylUserId) : null,
  ])

  const hasActiveSub = !!subscription
  const serverMax = subscription?.plan.planLimit?.serverMax ?? 0
  const activeServers = servers.filter((s) => s.status !== "terminated")
  const atLimit = activeServers.length >= serverMax
  const canCreate = hasActiveSub && !atLimit
  const emptySlots = Math.max(0, serverMax - activeServers.length)

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
      <div className="flex flex-col gap-6 p-8">

        {/* ── Pterodactyl profile ── */}
        {pteroUser && (
          <div className="flex items-center gap-4 rounded-xl border bg-card px-6 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">{pteroUser.first_name} {pteroUser.last_name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {pteroUser.email} · @{pteroUser.username}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto shrink-0">
              Panel #{pteroUser.id}
            </Badge>
          </div>
        )}

        {/* ── Server slots ── */}
        {hasActiveSub ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Filled slots */}
            {activeServers.map((server) => (
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

            {/* Empty slots */}
            {emptySlots > 0 && canCreate && (
              <Link href="/dashboard/servers/new">
                <div className="flex min-h-36 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <Plus className="size-4" />
                  <span className="text-sm font-medium">New server</span>
                </div>
              </Link>
            )}
            {Array.from({ length: atLimit ? emptySlots : Math.max(0, emptySlots - 1) }).map((_, i) => (
              <div
                key={`slot-${i}`}
                className="flex min-h-36 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground/30"
              >
                <Server className="size-5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
            <div className="flex flex-col items-center gap-2 text-center">
              <Server className="size-8 opacity-40" />
              <p className="text-sm font-medium">No active subscription</p>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/billing" className="underline underline-offset-4 hover:text-primary">
                  Subscribe to a plan
                </Link>{" "}
                to create your first server.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
