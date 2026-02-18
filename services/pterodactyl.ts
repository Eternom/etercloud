import { pteroFetch } from "@/lib/pterodactyl"
import type {
  PteroList,
  PteroServer,
  PteroUser,
  PteroNode,
  PteroLocation,
  PteroNest,
  PteroEgg,
  PteroAllocation,
  CreateServerOptions,
  UpdateServerDetailsOptions,
  UpdateServerBuildOptions,
  CreateUserOptions,
  UpdateUserOptions,
} from "@/types/pterodactyl"

class PteroService {

  // ── Servers ──────────────────────────────────────────────────────────────

  async listServers(): Promise<PteroServer[]> {
    const data = await pteroFetch<PteroList<PteroServer>>("/servers")
    return data.data.map((d) => d.attributes)
  }

  async getServer(id: number): Promise<PteroServer> {
    const data = await pteroFetch<{ attributes: PteroServer }>(`/servers/${id}`)
    return data.attributes
  }

  async createServer(options: CreateServerOptions): Promise<PteroServer> {
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

  async updateServerDetails(id: number, options: UpdateServerDetailsOptions): Promise<PteroServer> {
    const data = await pteroFetch<{ attributes: PteroServer }>(`/servers/${id}/details`, {
      method: "PATCH",
      body: JSON.stringify({
        name: options.name,
        user: options.userId,
        external_id: options.externalId,
        description: options.description,
      }),
    })
    return data.attributes
  }

  async updateServerBuild(id: number, options: UpdateServerBuildOptions): Promise<PteroServer> {
    const data = await pteroFetch<{ attributes: PteroServer }>(`/servers/${id}/build`, {
      method: "PATCH",
      body: JSON.stringify({
        allocation: options.allocationId,
        limits: options.limits,
        feature_limits: options.featureLimits,
      }),
    })
    return data.attributes
  }

  async suspendServer(id: number): Promise<void> {
    await pteroFetch<void>(`/servers/${id}/suspend`, { method: "POST" })
  }

  async unsuspendServer(id: number): Promise<void> {
    await pteroFetch<void>(`/servers/${id}/unsuspend`, { method: "POST" })
  }

  async reinstallServer(id: number): Promise<void> {
    await pteroFetch<void>(`/servers/${id}/reinstall`, { method: "POST" })
  }

  async deleteServer(id: number): Promise<void> {
    await pteroFetch<void>(`/servers/${id}`, { method: "DELETE" })
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers(): Promise<PteroUser[]> {
    const data = await pteroFetch<PteroList<PteroUser>>("/users")
    return data.data.map((d) => d.attributes)
  }

  async getUser(id: number): Promise<PteroUser> {
    const data = await pteroFetch<{ attributes: PteroUser }>(`/users/${id}`)
    return data.attributes
  }

  async createUser(options: CreateUserOptions): Promise<PteroUser> {
    const data = await pteroFetch<{ attributes: PteroUser }>("/users", {
      method: "POST",
      body: JSON.stringify({
        username: options.username,
        email: options.email,
        first_name: options.firstName,
        last_name: options.lastName,
        password: options.password,
      }),
    })
    return data.attributes
  }

  async updateUser(id: number, options: UpdateUserOptions): Promise<PteroUser> {
    const data = await pteroFetch<{ attributes: PteroUser }>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        username: options.username,
        email: options.email,
        first_name: options.firstName,
        last_name: options.lastName,
        password: options.password,
      }),
    })
    return data.attributes
  }

  async deleteUser(id: number): Promise<void> {
    await pteroFetch<void>(`/users/${id}`, { method: "DELETE" })
  }

  // ── Nodes ─────────────────────────────────────────────────────────────────

  async listNodes(): Promise<PteroNode[]> {
    const data = await pteroFetch<PteroList<PteroNode>>("/nodes")
    return data.data.map((d) => d.attributes)
  }

  async getNode(id: number): Promise<PteroNode> {
    const data = await pteroFetch<{ attributes: PteroNode }>(`/nodes/${id}`)
    return data.attributes
  }

  async deleteNode(id: number): Promise<void> {
    await pteroFetch<void>(`/nodes/${id}`, { method: "DELETE" })
  }

  // ── Locations ─────────────────────────────────────────────────────────────

  async listLocations(): Promise<PteroLocation[]> {
    const data = await pteroFetch<PteroList<PteroLocation>>("/locations")
    return data.data.map((d) => d.attributes)
  }

  async getLocation(id: number): Promise<PteroLocation> {
    const data = await pteroFetch<{ attributes: PteroLocation }>(`/locations/${id}`)
    return data.attributes
  }

  async deleteLocation(id: number): Promise<void> {
    await pteroFetch<void>(`/locations/${id}`, { method: "DELETE" })
  }

  // ── Nests ─────────────────────────────────────────────────────────────────

  async listNests(): Promise<PteroNest[]> {
    const data = await pteroFetch<PteroList<PteroNest>>("/nests")
    return data.data.map((d) => d.attributes)
  }

  async getNest(id: number): Promise<PteroNest> {
    const data = await pteroFetch<{ attributes: PteroNest }>(`/nests/${id}`)
    return data.attributes
  }

  // ── Eggs ──────────────────────────────────────────────────────────────────

  async listEggs(nestId: number): Promise<PteroEgg[]> {
    const data = await pteroFetch<PteroList<PteroEgg>>(`/nests/${nestId}/eggs`)
    return data.data.map((d) => d.attributes)
  }

  async getEgg(nestId: number, eggId: number): Promise<PteroEgg> {
    const data = await pteroFetch<{ attributes: PteroEgg }>(`/nests/${nestId}/eggs/${eggId}`)
    return data.attributes
  }

  // ── Allocations ───────────────────────────────────────────────────────────

  async listAllocations(nodeId: number): Promise<PteroAllocation[]> {
    const data = await pteroFetch<PteroList<PteroAllocation>>(`/nodes/${nodeId}/allocations`)
    return data.data.map((d) => d.attributes)
  }

  async deleteAllocation(nodeId: number, allocationId: number): Promise<void> {
    await pteroFetch<void>(`/nodes/${nodeId}/allocations/${allocationId}`, { method: "DELETE" })
  }
}

export const ptero = new PteroService()
