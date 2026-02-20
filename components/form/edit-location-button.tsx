"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit2, MapPin } from "lucide-react"
import { updateLocationSchema, type UpdateLocationData } from "@/helpers/validations/location"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

interface EditLocationButtonProps {
  id: string
  name: string
  currentLatitude: number | null
  currentLongitude: number | null
}

export function EditLocationButton({ id, name, currentLatitude, currentLongitude }: EditLocationButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateLocationData>({
    resolver: zodResolver(updateLocationSchema) as any,
    defaultValues: {
      latitude: currentLatitude ?? undefined,
      longitude: currentLongitude ?? undefined,
    },
  })

  const onSubmit = async (data: UpdateLocationData) => {
    setApiError(null)

    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message ?? "Failed to update location.")
      }

      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setApiError(err.message)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit2 className="mr-2 size-4" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Location</SheetTitle>
          <SheetDescription>
            Update the geographical coordinates for {name}. These are used to position the location on the world map.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  className="pl-9"
                  disabled={isSubmitting}
                  placeholder="e.g. 48.8566"
                  {...register("latitude")}
                />
              </div>
              <FieldError message={errors.latitude?.message} />
            </Field>

            <Field>
              <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  className="pl-9"
                  disabled={isSubmitting}
                  placeholder="e.g. 2.3522"
                  {...register("longitude")}
                />
              </div>
              <FieldError message={errors.longitude?.message} />
            </Field>

            <FieldError message={apiError ?? undefined} />
          </FieldGroup>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Save changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
