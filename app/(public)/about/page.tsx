import { HardDrive } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <HardDrive className="size-6" />
          EterCloud
        </div>
        <h1 className="text-4xl font-bold tracking-tight">About us</h1>
        <p className="text-muted-foreground">
          Game server hosting, simplified.
        </p>
      </div>

      <Separator className="mb-10" />

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">What is EterCloud?</h2>
          <p>
            EterCloud is a game server hosting platform built for players who want their server
            online in seconds — without any technical setup. Subscribe to a plan, pay monthly, and
            your server is provisioned automatically.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Our mission</h2>
          <p>
            We believe running a game server should be as easy as launching a game. Our goal is to
            remove every friction point between you and your players — from provisioning to billing
            to resource management.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Technology</h2>
          <p>
            EterCloud is powered by Pterodactyl, an open-source game server management panel trusted
            by thousands of hosting providers worldwide. Every server runs in its own isolated
            container, giving you dedicated resources and complete control.
          </p>
        </section>
      </div>
    </div>
  )
}
