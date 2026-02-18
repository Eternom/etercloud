import { Server, Activity, Cpu, MemoryStick } from "lucide-react"
import { StatCard } from "@/components/display/stat-card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to your EterCloud dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total servers"
          value="—"
          icon={Server}
        />
        <StatCard
          title="Active servers"
          value="—"
          icon={Activity}
        />
        <StatCard
          title="CPU usage"
          value="—"
          description="Combined across all your servers"
          icon={Cpu}
        />
        <StatCard
          title="RAM usage"
          value="—"
          description="Combined across all your servers"
          icon={MemoryStick}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your servers</h2>
        <p className="text-sm text-muted-foreground">
          No servers yet.
        </p>
      </div>
    </div>
  )
}
