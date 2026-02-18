import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ServerStatus = "active" | "inactive" | "suspended" | "terminated"

const statusConfig: Record<ServerStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  suspended: {
    label: "Suspended",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  terminated: {
    label: "Terminated",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
}

interface StatusBadgeProps {
  status: ServerStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn("gap-1.5", config.className, className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  )
}
