export const dynamic = 'force-dynamic'

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/navigation/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect("/login")
  if (session.user.role !== "admin") redirect("/dashboard")

  return (
    <SidebarProvider>
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? "admin",
        }}
      />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
