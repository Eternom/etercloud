import prisma from "@/lib/prisma"
import { SubscriptionTable } from "@/components/display/subscription-table"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">Platform-wide subscription overview</p>
      </div>

      <SubscriptionTable subscriptions={subscriptions} />
    </div>
  )
}
