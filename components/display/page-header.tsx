import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background px-4 sm:px-8",
        className
      )}
    >
      <SidebarTrigger className="mr-3 shrink-0" />
      <div className="flex flex-1 items-center min-w-0">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold leading-none truncate">{title}</h1>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </header>
  )
}
