import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { UpdateProfileForm } from "@/components/form/update-profile-form"
import { ChangePasswordForm } from "@/components/form/change-password-form"
import { SessionsList } from "@/components/display/sessions-list"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/display/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatMemberSince(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  return (
    <>
      <PageHeader title="Profile" />

      {/* Banner */}
      <div className="relative overflow-hidden border-b bg-card">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/20 via-primary/5 to-primary/0" />

        {/* Watermark initials */}
        <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[9rem] font-black leading-none text-primary/6">
          {getInitials(user.name)}
        </div>

        {/* Profile content */}
        <div className="relative max-w-3xl px-8 py-8">
          <div className="flex items-center gap-6">
            <Avatar className="size-20 ring-2 ring-primary/40">
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                  {user.role ?? "user"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Member since {formatMemberSince(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-8 max-w-3xl">
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
    </>
  )
}
