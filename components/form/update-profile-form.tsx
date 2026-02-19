"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/services/auth-client.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

interface UpdateProfileFormProps {
  currentName: string
  email: string
}

export function UpdateProfileForm({ currentName, email }: UpdateProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name.trim() || name === currentName) return

    setIsLoading(true)
    const { error } = await authClient.updateUser({ name: name.trim() })
    setIsLoading(false)

    if (error) {
      setError(error.message ?? "Failed to update profile.")
    } else {
      setSuccess(true)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile updated.</p>}
      <Button type="submit" disabled={isLoading || !name.trim() || name === currentName} className="self-start">
        {isLoading && <Spinner />}
        Save changes
      </Button>
    </form>
  )
}
