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
    <Card className={cn(
      "relative overflow-hidden border-none bg-card shadow-xl shadow-muted/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10",
      isCurrent && "ring-1 ring-primary",
      className,
    )}>
      {isCurrent && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-8 py-1 rotate-45 translate-x-8 translate-y-2">
            Actuel
          </div>
        </div>
      )}
      <CardHeader className="pt-10">
        <CardTitle className="text-2xl font-black">{name}</CardTitle>
        <CardDescription className="text-base min-h-[3rem]">{description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tight">{(priceInCents / 100).toFixed(2)}</span>
          <span className="text-xl font-bold text-muted-foreground">€</span>
          <span className="text-muted-foreground ml-1">/ mois</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 font-medium text-foreground/80">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-8 pt-2">
        <Button
          className={cn(
            "w-full rounded-full py-6 text-base font-bold",
            isCurrent ? "bg-muted/50 text-foreground" : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90"
          )}
          variant="ghost"
          disabled={isCurrent}
        >
          {isCurrent ? "Plan actuel" : "Choisir ce plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
