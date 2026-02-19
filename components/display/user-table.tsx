"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/display/data-table"
import { BanUserButton } from "@/components/form/ban-user-button"
import { UnbanUserButton } from "@/components/form/unban-user-button"
import { SetRoleButton } from "@/components/form/set-role-button"
import { DeleteUserButton } from "@/components/form/delete-user-button"
import type { AdminUser } from "@/types/admin"

const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue<string | null>("role")
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role || "user"}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => (row.banned ? "banned" : "active"),
    cell: ({ row }) =>
      row.original.banned ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      new Date(row.getValue<Date>("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          <SetRoleButton user={user} />
          {user.banned ? (
            <UnbanUserButton userId={user.id} />
          ) : (
            <BanUserButton userId={user.id} />
          )}
          <DeleteUserButton userId={user.id} userName={user.name} />
        </div>
      )
    },
  },
]

interface UserTableProps {
  users: AdminUser[]
}

export function UserTable({ users }: UserTableProps) {
  return (
    <DataTable
      columns={columns}
      data={users}
      filterPlaceholder="Search by name or email..."
    />
  )
}
