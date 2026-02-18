import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { SignOutButton } from "@/components/display/sign-out-button"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight">EterCloud</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <SidebarNav />
      </nav>

      <div className="p-4">
        <Separator className="mb-4" />
        <SignOutButton variant="ghost" className="w-full justify-start text-muted-foreground" />
      </div>
    </aside>
  )
}
