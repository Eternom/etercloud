import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Politique de confidentialité
        </p>
      </div>
      <Separator className="mb-10" />
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Content coming soon</EmptyTitle>
          <EmptyDescription>The privacy policy will be published here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
