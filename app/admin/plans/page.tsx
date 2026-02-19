import prisma from "@/lib/prisma"
import { PlanTable } from "@/components/display/plan-table"
import { CreatePlanForm } from "@/components/form/create-plan-form"
import type { AdminPlan } from "@/types/admin"

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    include: { planLimit: true },
    orderBy: { createdAt: "desc" },
  })

  const adminPlans: AdminPlan[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    stripePriceId: p.stripePriceId,
    price: p.price,
    createdAt: p.createdAt,
    planLimit: p.planLimit,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Subscription plans available to users. Each plan creates a Stripe product and price.
          </p>
        </div>
      </div>

      <CreatePlanForm />

      <PlanTable plans={adminPlans} />
    </div>
  )
}
