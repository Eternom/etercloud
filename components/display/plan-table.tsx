"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/display/data-table"
import { EditPlanButton } from "@/components/form/edit-plan-button"
import { DeletePlanButton } from "@/components/form/delete-plan-button"
import type { AdminPlan } from "@/types/admin"

const columns: ColumnDef<AdminPlan>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("description")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const cents = row.getValue<number>("price")
      return <span>{(cents / 100).toFixed(2)} €/mo</span>
    },
  },
  {
    id: "cpuMax",
    header: "CPU",
    accessorFn: (row) => row.planLimit?.cpuMax ?? "—",
    cell: ({ row }) => {
      const v = row.original.planLimit?.cpuMax
      return <span className="text-muted-foreground">{v != null ? `${v}%` : "—"}</span>
    },
  },
  {
    id: "memoryMax",
    header: "Memory",
    accessorFn: (row) => row.planLimit?.memoryMax ?? "—",
    cell: ({ row }) => {
      const v = row.original.planLimit?.memoryMax
      return <span className="text-muted-foreground">{v != null ? `${v} MB` : "—"}</span>
    },
  },
  {
    id: "diskMax",
    header: "Disk",
    accessorFn: (row) => row.planLimit?.diskMax ?? "—",
    cell: ({ row }) => {
      const v = row.original.planLimit?.diskMax
      return <span className="text-muted-foreground">{v != null ? `${v} MB` : "—"}</span>
    },
  },
  {
    id: "serverMax",
    header: "Servers",
    accessorFn: (row) => row.planLimit?.serverMax ?? "—",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.planLimit?.serverMax ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "stripePriceId",
    header: "Stripe Price ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.getValue<string>("stripePriceId")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 justify-end">
        <EditPlanButton planId={row.original.id} />
        <DeletePlanButton planId={row.original.id} planName={row.original.name} />
      </span>
    ),
  },
]

interface PlanTableProps {
  plans: AdminPlan[]
}

export function PlanTable({ plans }: PlanTableProps) {
  return (
    <DataTable
      columns={columns}
      data={plans}
      filterPlaceholder="Search by name..."
    />
  )
}
