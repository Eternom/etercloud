import { Cpu, HardDrive, MemoryStick, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/display/status-badge"

type ServerStatus = "active" | "inactive" | "suspended" | "terminated"

interface ServerCardProps {
  name: string
  identifier: string
  status: ServerStatus
  cpuUsage: number
  memoryUsageMb: number
  diskUsageMb: number
}

export function ServerCard({
  name,
  identifier,
  status,
  cpuUsage,
  memoryUsageMb,
  diskUsageMb,
}: ServerCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">{name}</CardTitle>
          <p className="font-mono text-xs text-muted-foreground">{identifier}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Cpu className="size-3.5" />
          {cpuUsage}%
        </span>
        <span className="flex items-center gap-1.5">
          <MemoryStick className="size-3.5" />
          {(memoryUsageMb / 1024).toFixed(1)} GB
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive className="size-3.5" />
          {(diskUsageMb / 1024).toFixed(1)} GB
        </span>
      </CardContent>
    </Card>
  )
}
