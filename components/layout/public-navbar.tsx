"use client"

import { useState } from "react"
import Link from "next/link"
import { HardDrive, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export interface NavLink {
  href: string
  label: string
}

interface PublicNavbarProps {
  isLoggedIn: boolean
  links?: NavLink[]
}

export function PublicNavbar({ isLoggedIn, links = [] }: PublicNavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <HardDrive className="size-5" />
          EterCloud
        </Link>

        {/* Desktop section links */}
        {links.length > 0 && (
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
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

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mb-6 flex items-center gap-2 text-lg font-bold">
              <HardDrive className="size-5" />
              EterCloud
            </div>
            {links.length > 0 && (
              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <Button asChild>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
