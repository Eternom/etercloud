"use client"

import { LayoutDashboard, Users, CreditCard, Server } from "lucide-react"
import { NavItem } from "@/components/navigation/nav-item"

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/servers", label: "Servers", icon: Server },
]

export function AdminNav() {
  return (
    <>
      {adminNavItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </>
  )
}
