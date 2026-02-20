import { Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">Get in touch with our team.</p>
      </div>

      <Separator className="mb-10" />

      <div className="flex flex-col gap-6 text-sm text-muted-foreground">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Support</h2>
          <p>For any question about your account, server, or subscription:</p>
          <a
            href="mailto:support@etercloud.com"
            className="flex items-center gap-2 font-medium text-foreground hover:underline"
          >
            <Mail className="size-4" />
            support@etercloud.com
          </a>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Response time</h2>
          <p>We aim to respond within 24 hours on business days.</p>
        </section>
      </div>
    </div>
  )
}
