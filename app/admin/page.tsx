import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/display/page-header"

export default async function AdminPage() {
  const [totalUsers, totalServers, stripeSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.server.count(),
    stripe.subscriptions.list({ limit: 100, status: "active" }),
  ])

  const activeSubscriptions = stripeSubscriptions.data.length

  const stats = [
    { title: "Total Users", value: totalUsers },
    { title: "Total Servers", value: totalServers },
    { title: "Active Subscriptions", value: activeSubscriptions },
  ]

  return (
    <>
      <PageHeader title="Overview" description="Platform statistics and quick metrics." />
      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
