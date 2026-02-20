"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HardDrive,
  Home,
  Tag,
  Info,
  Mail,
  LayoutDashboard,
  LogIn,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
]

interface PublicNavbarProps {
  isLoggedIn: boolean
}

export function Navbar({ isLoggedIn }: PublicNavbarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href
  }

  return (
    <>
      {/* ── Top bar (desktop only) ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:block">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 sm:px-6">

          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <HardDrive className="size-5" />
            EterCloud
          </Link>

          {/* Center — Nav */}
          <nav className="flex items-center justify-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive(href)
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right — CTAs */}
          <div className="flex items-center justify-end gap-2">
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom bar (4 nav + 1 auth = 5 icons) ───────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "flex flex-1 items-center justify-center py-2 transition-colors",
              isActive(href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-5" />
          </Link>
        ))}

        {/* Auth icon */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          aria-label={isLoggedIn ? "Dashboard" : "Sign in"}
          className={cn(
            "flex flex-1 items-center justify-center py-2 transition-colors",
            isActive(isLoggedIn ? "/dashboard" : "/login")
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {isLoggedIn
            ? <LayoutDashboard className="size-5" />
            : <LogIn className="size-5" />
          }
        </Link>
      </nav>
    </>
  )
}
