import prisma from "@/lib/prisma"
import { UserTable } from "@/components/display/user-table"
import { PageHeader } from "@/components/display/page-header"

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
    <>
      <PageHeader title="Users" description="Manage all platform users." />
      <div className="p-8">
        <UserTable users={users} />
      </div>
    </>
  )
}
