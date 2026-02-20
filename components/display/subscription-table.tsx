"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/display/data-table"
import type { AdminSubscription } from "@/types/admin"

const columns: ColumnDef<AdminSubscription>[] = [
  {
    id: "user",
    header: "User",
    accessorFn: (row) => row.user.name,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user.name}</div>
        <div className="text-xs text-muted-foreground">{row.original.user.email}</div>
      </div>
    ),
  },
  {
    id: "plan",
    header: "Plan",
    accessorFn: (row) => row.plan.name,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
      const variant =
        status === "active" ? "default"
        : status === "trialing" ? "secondary"
        : status === "canceled" ? "outline"
        : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "periodEnd",
    header: "Period End",
    cell: ({ row }) => {
      const date = row.getValue<Date | null>("periodEnd")
      return date ? new Date(date).toLocaleDateString() : "—"
    },
  },
  {
    accessorKey: "cancelAtPeriodEnd",
    header: "Auto-Renew",
    cell: ({ row }) =>
      row.getValue<boolean>("cancelAtPeriodEnd") ? (
        <Badge variant="outline">No</Badge>
      ) : (
        <Badge variant="default">Yes</Badge>
      ),
  },
]

interface SubscriptionTableProps {
  subscriptions: AdminSubscription[]
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  return (
    <DataTable
      columns={columns}
      data={subscriptions}
      filterPlaceholder="Search by user or plan..."
    />
  )
}
