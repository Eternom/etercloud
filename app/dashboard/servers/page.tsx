import { headers } from "next/headers"
import { Plus, Server, User } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { ptero } from "@/services/pterodactyl.service"
import { ServerCard } from "@/components/display/server-card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { PageHeader } from "@/components/display/page-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
      <div className="flex flex-col gap-6 p-4 sm:p-8">

        {/* ── Pterodactyl profile ── */}
        {pteroUser && (
          <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-10">
              <User className="size-4 text-primary sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{pteroUser.first_name} {pteroUser.last_name}</p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {pteroUser.email} · @{pteroUser.username}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              Panel #{pteroUser.id}
            </Badge>
          </div>
        )}

        {/* ── Server slots ── */}
        {hasActiveSub ? (
          <>
            {/* Mobile: carousel */}
            <div className="sm:hidden">
              {activeServers.length > 0 ? (
                <div className="-mx-4">
                  <Carousel opts={{ align: "start" }} className="w-full px-4">
                    <CarouselContent className="-ml-3">
                      {activeServers.map((server) => (
                        <CarouselItem key={server.id} className="pl-3 basis-[85%]">
                          <ServerCard
                            name={server.name}
                            identifier={server.identifierPtero}
                            status={server.status}
                            cpuUsage={server.cpuUsage}
                            memoryUsageMb={server.memoryUsage}
                            diskUsageMb={server.diskUsage}
                          />
                        </CarouselItem>
                      ))}
                      {canCreate && (
                        <CarouselItem className="pl-3 basis-[85%]">
                          <Link href="/dashboard/servers/new">
                            <div className="flex min-h-36 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                              <Plus className="size-4" />
                              <span className="text-sm font-medium">New server</span>
                            </div>
                          </Link>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                  </Carousel>
                </div>
              ) : (
                canCreate && (
                  <Link href="/dashboard/servers/new">
                    <div className="flex min-h-36 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground">
                      <Plus className="size-4" />
                      <span className="text-sm font-medium">Create your first server</span>
                    </div>
                  </Link>
                )
              )}

              {/* Slot dots indicator */}
              {serverMax > 0 && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {Array.from({ length: serverMax }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "size-2 rounded-full",
                        i < activeServers.length ? "bg-primary" : "border border-muted-foreground/30"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {activeServers.length} / {serverMax}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          </>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
            <div className="flex flex-col items-center gap-2 px-4 text-center">
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
