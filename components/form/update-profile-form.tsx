"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema, type UpdateProfileData } from "@/helpers/validations/profile"
import { authClient } from "@/services/auth-client.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

interface UpdateProfileFormProps {
  currentName: string
  email: string
}

export function UpdateProfileForm({ currentName, email }: UpdateProfileFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: currentName },
  })

  const onSubmit = async (data: UpdateProfileData) => {
    setApiError(null)
    setSuccess(false)

    const { error } = await authClient.updateUser({ name: data.name })

    if (error) {
      setApiError(error.message ?? "Failed to update profile.")
    } else {
      setSuccess(true)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" value={email} disabled />
        </Field>
        <Field>
          <FieldLabel htmlFor="name">Display name</FieldLabel>
          <Input
            id="name"
            type="text"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting && <Spinner />}
            Save changes
          </Button>
          <FieldError message={apiError ?? undefined} />
          {success && <p className="text-sm text-green-600">Profile updated.</p>}
        </Field>
      </FieldGroup>
    </form>
  )
}
