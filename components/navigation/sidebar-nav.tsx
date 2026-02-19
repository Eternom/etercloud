"use client"

import { LayoutDashboard, Server, CreditCard, User } from "lucide-react"
import { NavItem } from "@/components/navigation/nav-item"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/servers", label: "Servers", icon: Server },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function SidebarNav() {
  return (
    <>
      {navItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </>
  )
}
