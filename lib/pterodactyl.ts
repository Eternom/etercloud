export type * from "@/types/pterodactyl"

export async function pteroFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
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
