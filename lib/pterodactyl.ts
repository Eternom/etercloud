import type { CreateServerOptions, PteroServer } from "@/types/pterodactyl"

export type { PteroServer, PteroServerLimits, PteroServerFeatureLimits, CreateServerOptions } from "@/types/pterodactyl"

async function pteroFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = process.env.PTERODACTYL_URL
  const key = process.env.PTERODACTYL_API_KEY

  if (!url || !key) {
    throw new Error("PTERODACTYL_URL and PTERODACTYL_API_KEY must be set")
  }

  const res = await fetch(`${url.replace(/\/$/, "")}/api/application${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Pterodactyl ${res.status} on ${path}: ${body}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export async function getServer(serverId: number): Promise<PteroServer> {
  const data = await pteroFetch<{ attributes: PteroServer }>(`/servers/${serverId}`)
  return data.attributes
}

export async function createServer(options: CreateServerOptions): Promise<PteroServer> {
  const data = await pteroFetch<{ attributes: PteroServer }>("/servers", {
    method: "POST",
    body: JSON.stringify({
      name: options.name,
      user: options.userId,
      egg: options.eggId,
      docker_image: options.dockerImage,
      startup: options.startupCommand,
      environment: options.environment,
      limits: options.limits,
      feature_limits: {
        databases: options.featureLimits.databases,
        backups: options.featureLimits.backups,
        allocations: options.featureLimits.allocations,
      },
      allocation: { default: options.allocationId },
    }),
  })
  return data.attributes
}

export async function deleteServer(serverId: number): Promise<void> {
  await pteroFetch<void>(`/servers/${serverId}`, { method: "DELETE" })
}

export async function suspendServer(serverId: number): Promise<void> {
  await pteroFetch<void>(`/servers/${serverId}/suspend`, { method: "POST" })
}

export async function unsuspendServer(serverId: number): Promise<void> {
  await pteroFetch<void>(`/servers/${serverId}/unsuspend`, { method: "POST" })
}
