"use client"

import React, { useEffect, useState } from "react"
import nextDynamic from "next/dynamic"
import { type BasicLocation } from "./world-map-locations"

const WorldMapLocations = nextDynamic(
  () => import("./world-map-locations").then((mod) => mod.WorldMapLocations),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[21/9] w-full animate-pulse rounded-[2.5rem] bg-muted sm:aspect-[2.5/1]" />
    ),
  }
)

export function WorldMapClient({ locations }: { locations: BasicLocation[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="aspect-[21/9] w-full animate-pulse rounded-[2.5rem] bg-muted sm:aspect-[2.5/1]" />
    )
  }

  return <WorldMapLocations locations={locations} />
}
