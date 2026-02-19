import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { UpdateProfileForm } from "@/components/form/update-profile-form"
import { ChangePasswordForm } from "@/components/form/change-password-form"
import { SessionsList } from "@/components/display/sessions-list"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information and active sessions.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">Update your display name.</p>
        </div>
        <Separator />
        <UpdateProfileForm currentName={user.name} email={user.email} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Password</h2>
          <p className="text-sm text-muted-foreground">Change your account password.</p>
        </div>
        <Separator />
        <ChangePasswordForm />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage devices currently signed in to your account.
          </p>
        </div>
        <Separator />
        <SessionsList />
      </section>
    </div>
  )
}
