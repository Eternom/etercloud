import { z } from "zod"

export const updateLocationSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
})

export type UpdateLocationData = z.infer<typeof updateLocationSchema>
