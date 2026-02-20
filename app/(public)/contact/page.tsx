import { Mail, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <>
      {/* ── Hero header ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Contact</span>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Get in touch</h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Have a question about your account, server, or subscription? We&apos;re here to help.
          </p>
        </div>
      </section>

      <Separator />

      {/* ── Cards ── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
          <Card className="overflow-hidden border-none bg-card shadow-xl shadow-muted/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="pb-2 pt-8">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="size-7" />
              </div>
              <CardTitle className="text-xl font-bold">Support</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-8">
              <p className="text-base text-muted-foreground">
                For any question about your account, server, or subscription:
              </p>
              <a
                href="mailto:support@etercloud.com"
                className="text-base font-semibold transition-colors hover:text-primary hover:underline"
              >
                support@etercloud.com
              </a>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none bg-card shadow-xl shadow-muted/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="pb-2 pt-8">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <Clock className="size-7" />
              </div>
              <CardTitle className="text-xl font-bold">Response time</CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <p className="text-base text-muted-foreground">
                We aim to respond within 24 hours on business days.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
