// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export interface PteroMeta {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
}

export interface PteroList<T> {
  data: { attributes: T }[]
  meta: { pagination: PteroMeta }
}

// ---------------------------------------------------------------------------
// Servers
// ---------------------------------------------------------------------------

export interface PteroServerLimits {
  memory: number    // MB
  swap: number      // MB
  disk: number      // MB
  io: number        // 10–1000
  cpu: number       // %
}

export interface PteroServerFeatureLimits {
  databases: number
  backups: number
  allocations: number
}

export interface PteroServer {
  id: number
  uuid: string
  identifier: string
  name: string
  status: string | null
  limits: PteroServerLimits
  feature_limits: PteroServerFeatureLimits
  user: number
  node: number
  allocation: number
  nest: number
  egg: number
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

export interface UpdateServerDetailsOptions {
  name?: string
  userId?: number
  externalId?: string
  description?: string
}

export interface UpdateServerBuildOptions {
  allocationId?: number
  limits?: Partial<PteroServerLimits>
  featureLimits?: Partial<PteroServerFeatureLimits>
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface PteroUser {
  id: number
  uuid: string
  username: string
  email: string
  first_name: string
  last_name: string
  language: string
  root_admin: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserOptions {
  username: string
  email: string
  firstName: string
  lastName: string
  password?: string
}

export interface UpdateUserOptions {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  password?: string
}

// ---------------------------------------------------------------------------
// Nodes
// ---------------------------------------------------------------------------

export interface PteroNode {
  id: number
  uuid: string
  name: string
  description: string | null
  location_id: number
  fqdn: string
  scheme: string
  memory: number
  memory_overallocate: number
  disk: number
  disk_overallocate: number
  upload_size: number
  daemon_sftp: number
  daemon_listen: number
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

export interface PteroLocation {
  id: number
  short: string
  long: string
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Nests & Eggs
// ---------------------------------------------------------------------------

export interface PteroNest {
  id: number
  uuid: string
  author: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface PteroEgg {
  id: number
  uuid: string
  nest: number
  author: string
  name: string
  description: string | null
  docker_image: string
  startup: string
  created_at: string
  updated_at: string
}

export interface PteroEggVariable {
  name: string
  description: string
  env_variable: string   // key used in the environment map when creating a server
  default_value: string
  user_viewable: boolean
  user_editable: boolean
  rules: string
}

export interface PteroEggWithVariables extends PteroEgg {
  variables: PteroEggVariable[]
}

// ---------------------------------------------------------------------------
// Allocations
// ---------------------------------------------------------------------------

export interface PteroAllocation {
  id: number
  ip: string
  alias: string | null
  port: number
  notes: string | null
  assigned: boolean
}
