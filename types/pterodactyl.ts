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
  userId: number
  eggId: number
  dockerImage: string
  startupCommand: string
  environment: Record<string, string>
  limits: PteroServerLimits
  featureLimits: PteroServerFeatureLimits
  allocationId: number
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
