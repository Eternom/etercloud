'use client'

import { cn } from "@/lib/utils"
import {Eye, EyeOff} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInData } from "@/helpers/validations/auth"
import Link from "next/link"
import { signIn } from "@/lib/auth-client"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"


/**
 * Login form component with email/password authentication.
 * Handles form validation, password visibility toggle, and displays
 * a loading spinner with disabled fields during submission.
 *
 * @param {React.ComponentProps<"div">} props - Standard HTML div attributes
 * @param {string} [props.className] - Additional CSS classes to merge with the default layout
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const handleSignIn = async (data: SignInData) => {

    setError(null) // reset Error state before attempting to sign in

    const {error} = await signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message || "An error occurred during sign in")
    }else {
      window.location.href = "/dashboard" // Redirect to dashboard on successful sign in
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignIn)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" disabled={isSubmitting} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
                <FieldError id="email-error" message={errors.email?.message} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="/forgot-password" className="ml-auto text-sm">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative w-full">
                  <Input id="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} disabled={isSubmitting} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0  top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <FieldError id="password-error" message={errors.password?.message} />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Login
                </Button>
                <FieldError message={error ?? undefined} className="text-center" />
              </Field>
              <Field>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
