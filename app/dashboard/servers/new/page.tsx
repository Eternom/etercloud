import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BillingService } from "@/services/billing.service"
import { PageHeader } from "@/components/display/page-header"
import { NewServerForm } from "@/components/form/new-server-form"

export default async function NewServerPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { stripeCustomerId: true },
  })

  const subscription = await BillingService.getUserSubscription(user?.stripeCustomerId ?? null)

  if (!subscription) redirect("/dashboard/billing")

  const activeCount = await prisma.server.count({
    where: { userId: session!.user.id, status: { not: "terminated" } },
  })

  const limit = subscription.plan.planLimit
  if (!limit) redirect("/dashboard/servers")

  const serverMax = limit.serverMax
  if (activeCount >= serverMax) redirect("/dashboard/servers")

  // Calculate already-used resources across active servers
  const used = await prisma.server.aggregate({
    where: { userId: session!.user.id, status: { not: "terminated" } },
    _sum: {
      memoryUsage: true,
      cpuUsage: true,
      diskUsage: true,
      databaseUsage: true,
      backupUsage: true,
      allocatedUsage: true,
    },
  })

  const remaining = {
    memoryMax: limit.memoryMax - (used._sum.memoryUsage ?? 0),
    cpuMax: limit.cpuMax - (used._sum.cpuUsage ?? 0),
    diskMax: limit.diskMax - (used._sum.diskUsage ?? 0),
    databaseMax: limit.databaseMax - (used._sum.databaseUsage ?? 0),
    backupMax: limit.backupMax - (used._sum.backupUsage ?? 0),
    allocatedMax: limit.allocatedMax - (used._sum.allocatedUsage ?? 0),
  }

  const [locations, categories] = await Promise.all([
    prisma.location.findMany({
      where: { active: true },
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    }),
    prisma.gameCategory.findMany({
      where: { active: true },
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <>
      <PageHeader title="Create server" description="Configure and deploy a new game server." />
      <div className="p-8">
        <div className="max-w-lg">
          <NewServerForm
            locations={locations}
            categories={categories}
            limits={remaining}
          />
        </div>
      </div>
    </>
  )
}
