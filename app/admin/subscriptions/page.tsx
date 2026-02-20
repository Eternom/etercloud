import { BillingService } from "@/services/billing.service"
import { SubscriptionTable } from "@/components/display/subscription-table"
import { PageHeader } from "@/components/display/page-header"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await BillingService.listAllSubscriptions()

  return (
    <>
      <PageHeader title="Subscriptions" description="Platform-wide subscription overview." />
      <div className="p-8">
        <SubscriptionTable subscriptions={subscriptions} />
      </div>
    </>
  )
}
