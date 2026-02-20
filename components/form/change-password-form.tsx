"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { changePasswordSchema, type ChangePasswordData } from "@/helpers/validations/profile"
import { authClient } from "@/services/auth-client.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

export function ChangePasswordForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordData) => {
    setApiError(null)
    setSuccess(false)

    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: false,
    })

    if (error) {
      setApiError(error.message ?? "Failed to change password.")
    } else {
      setSuccess(true)
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="current-password">Current password</FieldLabel>
          <div className="relative w-full">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.currentPassword}
              aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
              {...register("currentPassword")}
            />
            <Button
              type="button"
              variant="link"
              size="icon"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FieldError id="current-password-error" message={errors.currentPassword?.message} />
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <div className="relative w-full">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.newPassword}
              aria-describedby={errors.newPassword ? "new-password-error" : undefined}
              {...register("newPassword")}
            />
            <Button
              type="button"
              variant="link"
              size="icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FieldError id="new-password-error" message={errors.newPassword?.message} />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
          <div className="relative w-full">
            <Input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmNewPassword}
              aria-describedby={errors.confirmNewPassword ? "confirm-new-password-error" : undefined}
              {...register("confirmNewPassword")}
            />
            <Button
              type="button"
              variant="link"
              size="icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FieldError id="confirm-new-password-error" message={errors.confirmNewPassword?.message} />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting && <Spinner />}
            Change password
          </Button>
          <FieldError message={apiError ?? undefined} />
          {success && <p className="text-sm text-green-600">Password changed successfully.</p>}
        </Field>
      </FieldGroup>
    </form>
  )
}
