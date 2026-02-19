import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditPlanForm } from "@/components/form/edit-plan-form"
import type { AdminPlan } from "@/types/admin"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPlanPage({ params }: Props) {
  const { id } = await params

  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { planLimit: true },
  })

  if (!plan) notFound()

  const adminPlan: AdminPlan = {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    stripePriceId: plan.stripePriceId,
    price: plan.price,
    createdAt: plan.createdAt,
    planLimit: plan.planLimit,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit plan</h1>
        <p className="text-muted-foreground">
          Updating the price archives the current Stripe price and creates a new one.
        </p>
      </div>

      <EditPlanForm plan={adminPlan} />
    </div>
  )
}
