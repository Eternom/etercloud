import prisma from "@/lib/prisma"
import { ServerTable } from "@/components/display/server-table"
import { PageHeader } from "@/components/display/page-header"

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
    <>
      <PageHeader title="Servers" description="Platform-wide server overview." />
      <div className="p-8">
        <ServerTable servers={servers} />
      </div>
    </>
  )
}
