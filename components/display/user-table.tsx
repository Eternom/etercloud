"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BanUserButton } from "@/components/form/ban-user-button"
import { UnbanUserButton } from "@/components/form/unban-user-button"
import { SetRoleButton } from "@/components/form/set-role-button"
import { DeleteUserButton } from "@/components/form/delete-user-button"
import type { AdminUser } from "@/types/admin"

interface UserTableProps {
  users: AdminUser[]
}

export function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role || "user"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <SetRoleButton user={user} />
                        {user.banned ? (
                          <UnbanUserButton userId={user.id} />
                        ) : (
                          <BanUserButton userId={user.id} />
                        )}
                        <DeleteUserButton userId={user.id} userName={user.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your search.
        </div>
      )}
    </div>
  )
}
