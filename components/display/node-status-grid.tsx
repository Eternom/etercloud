"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type NodeStatus = "operational" | "maintenance" | "unavailable"

export interface NodeResult {
  id: number
  name: string
  fqdn: string
  status: NodeStatus
}

const STATUS_CONFIG: Record<NodeStatus, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-green-500", text: "text-green-500" },
  maintenance: { label: "Maintenance", dot: "bg-yellow-500", text: "text-yellow-500" },
  unavailable: { label: "Unavailable", dot: "bg-red-500", text: "text-red-500" },
}

type Filter = "all" | NodeStatus

export function NodeStatusGrid({ nodes }: { nodes: NodeResult[] }) {
  const [filter, setFilter] = useState<Filter>("all")

  const counts = {
    operational: nodes.filter((n) => n.status === "operational").length,
    maintenance: nodes.filter((n) => n.status === "maintenance").length,
    unavailable: nodes.filter((n) => n.status === "unavailable").length,
  }

  const distinctStatuses = (["operational", "maintenance", "unavailable"] as NodeStatus[]).filter(
    (s) => counts[s] > 0,
  )
  const showFilter = distinctStatuses.length > 1

  const filtered = filter === "all" ? nodes : nodes.filter((n) => n.status === filter)

  return (
    <div>
      {showFilter && (
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All ({nodes.length})
          </FilterChip>
          {distinctStatuses.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {STATUS_CONFIG[s].label} ({counts[s]})
            </FilterChip>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((node) => {
          const config = STATUS_CONFIG[node.status]
          return (
            <div key={node.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{node.name}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{node.fqdn}</p>
                </div>
                <div className={cn("flex shrink-0 items-center gap-1.5 text-xs font-medium", config.text)}>
                  <span className="relative flex size-2">
                    {node.status === "operational" && (
                      <span
                        className={cn(
                          "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                          config.dot,
                        )}
                      />
                    )}
                    <span className={cn("relative inline-flex size-2 rounded-full", config.dot)} />
                  </span>
                  {config.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
