const PTERODACTYL_URL = process.env.PTERODACTYL_URL
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PteroServerLimits {
  memory: number   // MB
  swap: number     // MB
  disk: number     // MB
  io: number       // 10–1000
  cpu: number      // %
}

export interface PteroServerFeatureLimits {
  databases: number
  backups: number
  allocations: number
}

export interface CreateServerOptions {
  name: string
  userId: number          // Pterodactyl user ID
  eggId: number           // Egg ID
  dockerImage: string
  startupCommand: string
  environment: Record<string, string>
  limits: PteroServerLimits
  featureLimits: PteroServerFeatureLimits
  allocationId: number    // Default allocation ID
}

export interface PteroServer {
  id: number
  uuid: string
  identifier: string
  name: string
  status: string | null
  limits: PteroServerLimits
  feature_limits: PteroServerFeatureLimits
}

// ---------------------------------------------------------------------------
// Base fetch
// ---------------------------------------------------------------------------

async function pteroFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!PTERODACTYL_URL || !PTERODACTYL_API_KEY) {
    throw new Error("PTERODACTYL_URL and PTERODACTYL_API_KEY must be set")
  }

  const url = `${PTERODACTYL_URL.replace(/\/$/, "")}/api/application${path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Pterodactyl API error ${res.status} on ${path}: ${body}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// ---------------------------------------------------------------------------
// Server operations
// ---------------------------------------------------------------------------

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
      limits: {
        memory: options.limits.memory,
        swap: options.limits.swap,
        disk: options.limits.disk,
        io: options.limits.io,
        cpu: options.limits.cpu,
      },
      feature_limits: {
        databases: options.featureLimits.databases,
        backups: options.featureLimits.backups,
        allocations: options.featureLimits.allocations,
      },
      allocation: {
        default: options.allocationId,
      },
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
