import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { PublicNavbar } from "@/components/layout/public-navbar"
import { PublicFooter } from "@/components/layout/public-footer"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="bg-background text-foreground">
      <PublicNavbar isLoggedIn={!!session} />
      {children}
      <PublicFooter />
    </div>
  )
}
