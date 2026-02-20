import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditPlanForm } from "@/components/form/edit-plan-form"
import type { AdminPlan } from "@/types/admin"
import { PageHeader } from "@/components/display/page-header"

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
    <>
      <PageHeader title="Edit plan" description="Updating the price archives the current Stripe price and creates a new one." />
      <div className="p-8">
        <EditPlanForm plan={adminPlan} />
      </div>
    </>
  )
}
