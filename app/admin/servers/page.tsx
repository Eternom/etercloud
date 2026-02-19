import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminServersPage() {
  const servers = await prisma.server.findMany({
    include: {
      user: { select: { name: true, email: true } },
      location: { select: { name: true } },
      gameCategory: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "outline"
      case "terminated":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
        <p className="text-muted-foreground">Platform-wide server overview</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Owner</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Game</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">CPU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Memory</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Disk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {servers.map((server) => (
                  <tr key={server.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{server.name}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm">{server.user.name}</div>
                        <div className="text-xs text-muted-foreground">{server.user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusColor(server.status)}>
                        {server.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {server.location?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {server.gameCategory?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{server.cpuUsage}%</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatBytes(server.memoryUsage)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatBytes(server.diskUsage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {servers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No servers found.
        </div>
      )}
    </div>
  )
}
