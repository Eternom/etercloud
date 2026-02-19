import prisma from "@/lib/prisma"
import { ptero } from "@/services/pterodactyl.service"

/**
 * Returns the Pterodactyl user ID for a given EterCloud user.
 * Creates the Pterodactyl account on first call (lazy creation).
 */
export async function getOrCreatePteroUserId(userId: string): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  if (user.pterodactylUserId !== null) {
    return user.pterodactylUserId
  }

  const pteroUser = await ptero.createUser({
    username: user.email.split("@")[0].replace(/[^a-z0-9]/gi, "_").toLowerCase(),
    email: user.email,
    firstName: user.name.split(" ")[0] || user.name,
    lastName: user.name.split(" ").slice(1).join(" ") || "-",
  })

  await prisma.user.update({
    where: { id: userId },
    data: { pterodactylUserId: pteroUser.id },
  })

  return pteroUser.id
}
