import { Server } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default function ServersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Servers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your game servers.
        </p>
      </div>

      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Server />
          </EmptyMedia>
          <EmptyTitle>No servers</EmptyTitle>
          <EmptyDescription>
            Your servers will appear here once created.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
