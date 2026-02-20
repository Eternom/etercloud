import { ptero } from "@/services/pterodactyl.service"
import prisma from "@/lib/prisma"
import { LocationTable, type MergedLocation } from "@/components/display/location-table"
import { PageHeader } from "@/components/display/page-header"

export default async function AdminLocationsPage() {
  const [pteroLocations, dbLocations] = await Promise.all([
    ptero.listLocations(),
    prisma.location.findMany({
      include: { _count: { select: { servers: true } } },
    }),
  ])

  const dbByPteroId = new Map(dbLocations.map((l) => [l.pteroId, l]))

  const locations: MergedLocation[] = pteroLocations.map((pl) => {
    const db = dbByPteroId.get(pl.id)
    return {
      pteroId: pl.id,
      name: pl.short,
      description: pl.long,
      synced: !!db,
      dbId: db?.id ?? null,
      active: db?.active ?? false,
      serverCount: db?._count.servers ?? 0,
    }
  })

  return (
    <>
      <PageHeader title="Locations" description="Pterodactyl locations available for server deployment." />
      <div className="p-8">
        <LocationTable locations={locations} />
      </div>
    </>
  )
}
