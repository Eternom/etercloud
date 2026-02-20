"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "neon",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & { variant?: "default" | "neon" }) {
  const base = "shrink-0 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full"
  const variants = {
    default: "bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
    neon:
      "bg-gradient-to-r from-primary via-secondary to-primary opacity-90 data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 shadow-[0_0_16px] shadow-primary/25",
  } as const

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  )
}

export { Separator }
