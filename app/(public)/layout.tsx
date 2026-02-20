import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="bg-background text-foreground">
      <Navbar isLoggedIn={!!session} />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}
