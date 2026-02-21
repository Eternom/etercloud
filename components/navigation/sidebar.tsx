import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { NavItems } from "@/components/navigation/nav-item"
import { SidebarUserMenu } from "@/components/navigation/sidebar-user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export async function AppSidebar() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-10 items-center px-2">
          <span className="text-lg font-bold tracking-tight">EterCloud</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {session && (
          <SidebarUserMenu
            name={session.user.name}
            email={session.user.email}
            role={session.user.role ?? "user"}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
