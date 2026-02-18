import { Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlanLimit {
  cpuMax: number
  memoryMax: number
  diskMax: number
  serverMax: number
  databaseMax: number
  backupMax: number
}

interface PlanCardProps {
  name: string
  description: string
  priceInCents: number
  planLimit: PlanLimit
  isCurrent?: boolean
  className?: string
}

export function PlanCard({
  name,
  description,
  priceInCents,
  planLimit,
  isCurrent = false,
  className,
}: PlanCardProps) {
  const features = [
    `${planLimit.serverMax} serveur${planLimit.serverMax > 1 ? "s" : ""}`,
    `${planLimit.cpuMax}% CPU`,
    `${planLimit.memoryMax / 1024} Go RAM`,
    `${planLimit.diskMax / 1024} Go stockage`,
    `${planLimit.databaseMax} base${planLimit.databaseMax > 1 ? "s" : ""} de données`,
    `${planLimit.backupMax} backup${planLimit.backupMax > 1 ? "s" : ""}`,
  ]

  return (
    <Card className={cn("relative gap-4", isCurrent && "border-primary", className)}>
      {isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Plan actuel
        </span>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p className="mt-2 text-3xl font-bold">
          {(priceInCents / 100).toFixed(2)}€
          <span className="text-sm font-normal text-muted-foreground"> / mois</span>
        </p>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? "outline" : "default"}
          disabled={isCurrent}
        >
          {isCurrent ? "Plan actuel" : "Choisir ce plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
