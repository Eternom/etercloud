import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { stripe } from "@better-auth/stripe"
import stripeClient from "@/lib/stripe";
import { nextCookies } from "better-auth/next-js";

/**
 * Server-side BetterAuth instance.
 * Configured with Prisma (PostgreSQL) and email/password authentication.
 * Used by the catch-all route handler at `/api/auth/[...all]`.
 */
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
        }),
        nextCookies(), // Gestion automatique des cookies pour Next.js
    ],
});