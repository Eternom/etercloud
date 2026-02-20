import { z } from "zod"

/**
 * Validation schema for the update profile form.
 *
 * @property {string} name - Display name (2–100 characters)
 */
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
})

/** Inferred type from the update profile schema. */
export type UpdateProfileData = z.infer<typeof updateProfileSchema>

/**
 * Validation schema for the change password form.
 *
 * @property {string} currentPassword - Current password (required)
 * @property {string} newPassword - New password (6–100 characters, must contain at least one uppercase, one lowercase, and one digit)
 * @property {string} confirmNewPassword - Password confirmation (must match `newPassword`)
 */
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one digit"),
    confirmNewPassword: z
        .string()
        .min(1, "Please confirm your new password"),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
})

/** Inferred type from the change password schema. */
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
