import prisma from "@/lib/prisma"
import { PlanTable } from "@/components/display/plan-table"
import { CreatePlanForm } from "@/components/form/create-plan-form"
import type { AdminPlan } from "@/types/admin"
import { PageHeader } from "@/components/display/page-header"

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
    <>
      <PageHeader
        title="Plans"
        description="Subscription plans available to users."
        action={<CreatePlanForm />}
      />
      <div className="p-8">
        <PlanTable plans={adminPlans} />
      </div>
    </>
  )
}
