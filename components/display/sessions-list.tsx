"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Monitor, LogOut, Loader2, Eye, EyeOff } from "lucide-react"
import { authClient, useSession } from "@/services/auth-client.service"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Session {
  id: string
  token: string
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function parseDevice(userAgent?: string | null): string {
  if (!userAgent) return "Unknown device"
  if (/mobile/i.test(userAgent)) return "Mobile"
  if (/tablet/i.test(userAgent)) return "Tablet"
  return "Desktop"
}

export function SessionsList() {
  const router = useRouter()
  const { data: activeSession } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [isRevokingOthers, setIsRevokingOthers] = useState(false)
  const [showIps, setShowIps] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await authClient.listSessions()
      setSessions((data ?? []) as Session[])
      setIsLoading(false)
    }
    load()
  }, [])

  async function handleRevoke(token: string, id: string) {
    setRevokingId(id)
    await authClient.revokeSession({ token })
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setRevokingId(null)
  }

  async function handleRevokeOthers() {
    setIsRevokingOthers(true)
    await authClient.revokeOtherSessions()
    const { data } = await authClient.listSessions()
    setSessions((data ?? []) as Session[])
    setIsRevokingOthers(false)
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading sessions…
      </div>
    )
  }

  const activeToken = activeSession?.session?.token
  const otherSessions = sessions.filter((s) => s.token !== activeToken)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{sessions.length} active session{sessions.length !== 1 ? "s" : ""}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowIps(!showIps)}
          className="h-7 gap-1.5 text-xs text-muted-foreground"
        >
          {showIps ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {showIps ? "Hide IPs" : "Show IPs"}
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {sessions.map((session) => {
          const isCurrent = session.token === activeToken
          return (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Monitor className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{parseDevice(session.userAgent)}</span>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">Current session</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {showIps ? (session.ipAddress ?? "Unknown IP") : "••••••••••"} · {formatDate(session.createdAt)}
                  </span>
                </div>
              </div>
              {!isCurrent && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRevoke(session.token, session.id)}
                  disabled={revokingId === session.id}
                >
                  {revokingId === session.id ? <Spinner /> : <LogOut className="size-4" />}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {otherSessions.length > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevokeOthers}
            disabled={isRevokingOthers}
            className="self-start"
          >
            {isRevokingOthers && <Spinner />}
            Sign out of all other sessions
          </Button>
        </>
      )}
    </div>
  )
}
