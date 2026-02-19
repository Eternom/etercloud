"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/display/data-table"
import { SyncLocationButton } from "@/components/form/sync-location-button"
import { ToggleLocationButton } from "@/components/form/toggle-location-button"

export type MergedLocation = {
  pteroId: number
  name: string
  description: string
  synced: boolean
  dbId: string | null
  active: boolean
  serverCount: number
}

const columns: ColumnDef<MergedLocation>[] = [
  {
    accessorKey: "pteroId",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">#{row.getValue("pteroId")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Short name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue<string>("description") || "—"}</span>
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
      return <span className="text-muted-foreground">{row.original.synced ? count : "—"}</span>
    },
  },
  {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => {
      const loc = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          {!loc.synced ? (
            <SyncLocationButton
              pteroId={loc.pteroId}
              name={loc.name}
              description={loc.description}
            />
          ) : (
            <ToggleLocationButton id={loc.dbId!} active={loc.active} />
          )}
        </div>
      )
    },
  },
]

interface LocationTableProps {
  locations: MergedLocation[]
}

export function LocationTable({ locations }: LocationTableProps) {
  return (
    <DataTable
      columns={columns}
      data={locations}
      filterPlaceholder="Search by name or description..."
    />
  )
}
