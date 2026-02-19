"use client"

import { LayoutDashboard, Users, CreditCard, Server, MapPin, PackageCheck } from "lucide-react"
import { NavItem } from "@/components/navigation/nav-item"
import { SidebarUserMenu } from "@/components/navigation/sidebar-user-menu"

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/servers", label: "Servers", icon: Server },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight">EterCloud Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {adminNavItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t p-3">
        <SidebarUserMenu name={user.name} email={user.email} role={user.role} />
      </div>
    </aside>
  )
}
