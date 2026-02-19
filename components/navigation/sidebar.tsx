import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { SidebarUserMenu } from "@/components/navigation/sidebar-user-menu"

export async function Sidebar() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight">EterCloud</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <SidebarNav />
      </nav>

      <div className="border-t p-3">
        {session && (
          <SidebarUserMenu
            name={session.user.name}
            email={session.user.email}
            role={session.user.role ?? "user"}
          />
        )}
      </div>
    </aside>
  )
}
