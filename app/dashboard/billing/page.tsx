import { CreditCard } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CreditCard />
          </EmptyMedia>
          <EmptyTitle>No billing information</EmptyTitle>
          <EmptyDescription>
            Your subscription details will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
