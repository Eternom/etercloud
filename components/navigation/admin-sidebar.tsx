"use client"

import { LayoutDashboard, Users, CreditCard, Server, MapPin, PackageCheck, Gamepad2 } from "lucide-react"
import { NavItem } from "@/components/navigation/nav-item"
import { SidebarUserMenu } from "@/components/navigation/sidebar-user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/servers", label: "Servers", icon: Server },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/game-categories", label: "Game categories", icon: Gamepad2 },
  { href: "/admin/plans", label: "Plans", icon: PackageCheck },
]

interface AdminSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-10 items-center px-2">
          <span className="text-lg font-bold tracking-tight">EterCloud Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavItem href={item.href} label={item.label} icon={item.icon} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu name={user.name} email={user.email} role={user.role} />
      </SidebarFooter>
    </Sidebar>
  )
}
