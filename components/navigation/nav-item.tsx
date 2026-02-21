"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Server, CreditCard, User, type LucideIcon } from "lucide-react"
import { SidebarMenuButton, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/servers", label: "Servers", icon: Server },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
      <Link href={href}>
        <Icon />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  )
}

export function NavItems() {
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <NavItem href={item.href} label={item.label} icon={item.icon} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
