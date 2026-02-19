import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "trialing":
        return "secondary"
      case "canceled":
        return "outline"
      default:
        return "destructive"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">Platform-wide subscription overview</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Period End</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Auto-Renew</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium">{sub.user.name}</div>
                        <div className="text-xs text-muted-foreground">{sub.user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{sub.plan.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusColor(sub.status)}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(sub.periodEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {sub.cancelAtPeriodEnd ? (
                        <Badge variant="outline">No</Badge>
                      ) : (
                        <Badge variant="default">Yes</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {subscriptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No subscriptions found.
        </div>
      )}
    </div>
  )
}
