"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/display/data-table"
import { SyncGameCategoryButton } from "@/components/form/sync-game-category-button"
import { ToggleGameCategoryButton } from "@/components/form/toggle-game-category-button"

export type MergedGameCategory = {
  nestId: number
  nestName: string
  eggId: number
  name: string
  description: string
  dockerImage: string
  startup: string
  synced: boolean
  dbId: string | null
  active: boolean
  serverCount: number
}

const columns: ColumnDef<MergedGameCategory>[] = [
  {
    accessorKey: "nestName",
    header: "Nest",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.getValue("nestName")}</span>
    ),
  },
  {
    accessorKey: "eggId",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">#{row.getValue("eggId")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 max-w-xs text-xs">
        {row.getValue<string>("description") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "synced",
    header: "Synced",
    cell: ({ row }) =>
      row.getValue<boolean>("synced") ? (
        <Badge variant="default">Synced</Badge>
      ) : (
        <Badge variant="outline">Not synced</Badge>
      ),
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      if (!row.original.synced) return <span className="text-muted-foreground">—</span>
      return row.getValue<boolean>("active") ? (
        <Badge variant="default">Active</Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      )
    },
  },
  {
    accessorKey: "serverCount",
    header: "Servers",
    cell: ({ row }) => {
      const count = row.getValue<number>("serverCount")
      return (
        <span className="text-muted-foreground">{row.original.synced ? count : "—"}</span>
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => {
      const cat = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          {!cat.synced ? (
            <SyncGameCategoryButton
              nestId={cat.nestId}
              eggId={cat.eggId}
              name={cat.name}
              description={cat.description}
              dockerImage={cat.dockerImage}
              startup={cat.startup}
            />
          ) : (
            <ToggleGameCategoryButton id={cat.dbId!} active={cat.active} />
          )}
        </div>
      )
    },
  },
]

interface GameCategoryTableProps {
  categories: MergedGameCategory[]
}

export function GameCategoryTable({ categories }: GameCategoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={categories}
      filterPlaceholder="Search by name or nest..."
    />
  )
}
