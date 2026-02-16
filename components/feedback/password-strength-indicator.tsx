'use client'

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

const STRENGTH_LEVELS = [
  { label: "Weak", color: "[&>div]:bg-red-500" },
  { label: "Weak", color: "[&>div]:bg-red-500" },
  { label: "Fair", color: "[&>div]:bg-orange-500" },
  { label: "Good", color: "[&>div]:bg-yellow-500" },
  { label: "Strong", color: "[&>div]:bg-green-500" },
] as const

/**
 * Visual password strength indicator using the Progress component.
 * Evaluates strength based on: length >= 6, uppercase, lowercase, digit, special character.
 *
 * @param {string} password - The current password value to evaluate
 */
export function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = useMemo(() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 6) s++
    if (/[A-Z]/.test(password)) s++
    if (/[a-z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return Math.min(s, 4)
  }, [password])

  const { label, color } = STRENGTH_LEVELS[password ? score : 0]

  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        password ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col gap-1.5 pt-1">
          <Progress
            value={password ? (score / 4) * 100 : 0}
            aria-label={`Password strength: ${label}`}
            className={cn("h-1.5 transition-colors duration-300", color)}
          />
          <p className="text-muted-foreground text-xs transition-opacity duration-300">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}
