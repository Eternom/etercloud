import { z } from "zod"

/**
 * Validation schema for the login form.
 *
 * @property {string} email - Valid email address (max 255 characters)
 * @property {string} password - Password (6–100 characters)
 */
export const signInSchema = z.object({
    email: z
        .email({ message: "Veuillez entrer une adresse e-mail valide" })
        .max(255, "L'adresse e-mail doit contenir au maximum 255 caractères"),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe doit contenir au maximum 100 caractères"),
})

/** Inferred type from the sign-in schema. */
export type SignInData = z.infer<typeof signInSchema>

/**
 * Validation schema for the signup form.
 *
 * @property {string} name - Full name (2–100 characters)
 * @property {string} email - Valid email address (max 255 characters)
 * @property {string} password - Password (6–100 characters, must contain at least one uppercase, one lowercase, and one digit)
 * @property {string} confirmPassword - Password confirmation (must match `password`)
 */
export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom doit contenir au maximum 100 caractères"),
    email: z
        .email({ message: "Veuillez entrer une adresse e-mail valide" })
        .max(255, "L'adresse e-mail doit contenir au maximum 255 caractères"),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe doit contenir au maximum 100 caractères")
        .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
    confirmPassword: z
        .string()
        .min(6, "Le mot de passe de confirmation doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe de confirmation doit contenir au maximum 100 caractères"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

/** Inferred type from the sign-up schema. */
export type SignUpData = z.infer<typeof signUpSchema>