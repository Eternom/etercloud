import { ptero } from "@/services/pterodactyl.service"
import prisma from "@/lib/prisma"
import { GameCategoryTable, type MergedGameCategory } from "@/components/display/game-category-table"
import { PageHeader } from "@/components/display/page-header"
import { SyncAllGameCategoriesButton } from "@/components/form/sync-all-game-categories-button"

export default async function AdminGameCategoriesPage() {
  const [nests, dbCategories] = await Promise.all([
    ptero.listNests(),
    prisma.gameCategory.findMany({
      include: { _count: { select: { servers: true } } },
    }),
  ])

  const dbByEggId = new Map(dbCategories.map((c) => [c.pteroEggId, c]))

  const eggsPerNest = await Promise.all(
    nests.map(async (nest) => {
      const eggs = await ptero.listEggs(nest.id)
      return eggs.map((egg) => {
        const db = dbByEggId.get(egg.id)
        return {
          nestId: nest.id,
          nestName: nest.name,
          eggId: egg.id,
          name: egg.name,
          description: egg.description ?? "",
          dockerImage: egg.docker_image,
          startup: egg.startup,
          synced: !!db,
          dbId: db?.id ?? null,
          active: db?.active ?? false,
          serverCount: db?._count.servers ?? 0,
        } satisfies MergedGameCategory
      })
    }),
  )

  const categories = eggsPerNest.flat()

  return (
    <>
      <PageHeader
        title="Game categories"
        description="Pterodactyl eggs available for server deployment."
        action={<SyncAllGameCategoriesButton />}
      />
      <div className="p-8">
        <GameCategoryTable categories={categories} />
      </div>
    </>
  )
}
