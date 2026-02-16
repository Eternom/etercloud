import { z } from "zod"

// ========================================
// SCHÉMA DE CONNEXION
// ========================================
export const signInSchema = z.object({
    email: z
        .email({ message: "Veuillez entrer une adresse e-mail valide" })
        .max(255, "L'adresse e-mail doit contenir au maximum 255 caractères"),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe doit contenir au maximum 100 caractères"),
})

export type SignInData = z.infer<typeof signInSchema>

// ========================================
// SCHÉMA D'INSCRIPTION
// ========================================
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
        .max(100, "Le mot de passe doit contenir au maximum 100 caractères"),
    confirmPassword: z
        .string()
        .min(6, "Le mot de passe de confirmation doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe de confirmation doit contenir au maximum 100 caractères"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export type SignUpData = z.infer<typeof signUpSchema>