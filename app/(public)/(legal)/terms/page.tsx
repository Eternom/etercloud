import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conditions Générales d&apos;Utilisation (CGU)
        </p>
      </div>
      <Separator className="mb-10" />
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Content coming soon</EmptyTitle>
          <EmptyDescription>The terms of service will be published here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
