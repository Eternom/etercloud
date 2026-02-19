import prisma from "@/lib/prisma"
import { ServerTable } from "@/components/display/server-table"

export default async function AdminServersPage() {
  const servers = await prisma.server.findMany({
    include: {
      user: { select: { name: true, email: true } },
      location: { select: { name: true } },
      gameCategory: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
        <p className="text-muted-foreground">Platform-wide server overview</p>
      </div>

      <ServerTable servers={servers} />
    </div>
  )
}
