import Link from "next/link"
import { HardDrive } from "lucide-react"

const FOOTER_LINKS = {
  platform: [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/status", label: "System status" },
  ],
  support: [
    { href: "/contact", label: "Contact" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Sign in" },
    { href: "/signup", label: "Sign up" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/cgv", label: "Terms of Sale" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/legal-notice", label: "Legal Notice" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card py-24 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main grid */}
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <HardDrive className="size-6" />
              </div>
              EterCloud
            </Link>
            <p className="mt-6 max-w-xs text-lg leading-relaxed text-muted-foreground">
              Game server hosting, simplified. <br />
              Professional performance for everyone.
            </p>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            {/* Platform */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                Platform
              </h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                Support
              </h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                Legal
              </h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-10 text-sm font-medium text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} EterCloud. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="hover:text-primary transition-colors cursor-default">Powered by Pterodactyl</p>
            <div className="size-1.5 rounded-full bg-border" />
            <p className="hover:text-primary transition-colors cursor-default">Stripe Secure Payments</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
