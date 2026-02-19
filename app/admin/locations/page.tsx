import { ptero } from "@/services/pterodactyl"
import prisma from "@/lib/prisma"
import { LocationTable, type MergedLocation } from "@/components/display/location-table"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
        <p className="text-muted-foreground">
          Pterodactyl locations available for server deployment. Sync a location to make it selectable.
        </p>
      </div>

      <LocationTable locations={locations} />
    </div>
  )
}
