"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EditPlanButtonProps {
  planId: string
}

export function EditPlanButton({ planId }: EditPlanButtonProps) {
  return (
    <Button size="sm" variant="ghost" asChild>
      <Link href={`/admin/plans/${planId}/edit`}>Edit</Link>
    </Button>
  )
}
