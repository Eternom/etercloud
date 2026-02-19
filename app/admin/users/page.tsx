import prisma from "@/lib/prisma"
import { UserTable } from "@/components/display/user-table"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage all platform users</p>
      </div>

      <UserTable users={users} />
    </div>
  )
}
