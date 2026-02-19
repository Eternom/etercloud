"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/display/data-table"
import type { AdminServer } from "@/types/admin"

function formatBytes(mb: number) {
  if (mb === 0) return "0 MB"
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

const columns: ColumnDef<AdminServer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    id: "owner",
    header: "Owner",
    accessorFn: (row) => row.user.name,
    cell: ({ row }) => (
      <div>
        <div>{row.original.user.name}</div>
        <div className="text-xs text-muted-foreground">{row.original.user.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
      const variant =
        status === "active" ? "default"
        : status === "inactive" ? "secondary"
        : status === "suspended" ? "outline"
        : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) => row.location?.name ?? "—",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.location?.name ?? "—"}
      </span>
    ),
  },
  {
    id: "game",
    header: "Game",
    accessorFn: (row) => row.gameCategory?.name ?? "—",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.gameCategory?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "cpuUsage",
    header: "CPU",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue<number>("cpuUsage")}%</span>
    ),
  },
  {
    accessorKey: "memoryUsage",
    header: "Memory",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatBytes(row.getValue<number>("memoryUsage"))}</span>
    ),
  },
  {
    accessorKey: "diskUsage",
    header: "Disk",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatBytes(row.getValue<number>("diskUsage"))}</span>
    ),
  },
]

interface ServerTableProps {
  servers: AdminServer[]
}

export function ServerTable({ servers }: ServerTableProps) {
  return (
    <DataTable
      columns={columns}
      data={servers}
      filterPlaceholder="Search by name or owner..."
    />
  )
}
