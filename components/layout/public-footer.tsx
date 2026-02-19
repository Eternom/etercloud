import Link from "next/link"
import { HardDrive } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <HardDrive className="size-4" />
          EterCloud
        </div>
        <p>Game server hosting, simplified.</p>
        <div className="flex gap-4">
          <Link href="/status" className="transition-colors hover:text-foreground">
            Status
          </Link>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/signup" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  )
}
