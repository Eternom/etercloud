import Link from "next/link"
import { HardDrive } from "lucide-react"

const FOOTER_LINKS = {
  platform: [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#locations", label: "Locations" },
    { href: "/#games", label: "Games" },
  ],
  support: [
    { href: "/status", label: "System status" },
    { href: "/#faq", label: "FAQ" },
  ],
  account: [
    { href: "/login", label: "Sign in" },
    { href: "/signup", label: "Sign up" },
    { href: "/dashboard", label: "Dashboard" },
  ],
}

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-base font-bold">
              <HardDrive className="size-5" />
              EterCloud
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Game server hosting, simplified. Deploy in seconds, pay monthly, cancel anytime.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Account
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} EterCloud. All rights reserved.</p>
          <p>Powered by Pterodactyl.</p>
        </div>
      </div>
    </footer>
  )
}
