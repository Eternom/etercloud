"use client"

import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Topology public domain (Natural Earth via world-atlas)
const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export type BasicLocation = {
  id: string
  name: string
  description?: string | null
  latitude?: number | null
  longitude?: number | null
}

// Fallback mapping if coordinates are missing in DB
const NAME_TO_COORDS: Record<string, [number, number]> = {
  "Paris": [2.3522, 48.8566],
  "London": [-0.1278, 51.5074],
  "Frankfurt": [8.6821, 50.1109],
  "Amsterdam": [4.9041, 52.3676],
  "New York": [-74.006, 40.7128],
  "San Francisco": [-122.4194, 37.7749],
  "Los Angeles": [-118.2437, 34.0522],
  "Dallas": [-96.797, 32.7767],
  "Toronto": [-79.3832, 43.6532],
  "São Paulo": [-46.6396, -23.5558],
  "Dubai": [55.2708, 25.2048],
  "Tokyo": [139.6503, 35.6762],
  "Singapore": [103.8198, 1.3521],
  "Seoul": [126.978, 37.5665],
  "Mumbai": [72.8777, 19.076],
  "Sydney": [151.2093, -33.8688],
  "Hong Kong": [114.1694, 22.3193],
}

export function WorldMapLocations({
  locations,
  className,
}: {
  locations: BasicLocation[]
  className?: string
}) {
  const landFill = "hsl(var(--primary) / 0.08)"
  const landStroke = "hsl(var(--primary) / 0.25)"
  const markerFill = "hsl(var(--primary))"

  return (
    <TooltipProvider>
      <div className={cn("relative w-full", className)}>
        <div className="aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-primary/10 bg-gradient-to-b from-background to-background/60 p-4 shadow-2xl sm:aspect-[2.5/1]">
          <ComposableMap
            projection="geoEquirectangular"
            style={{ width: "100%", height: "100%" }}
            projectionConfig={{ scale: 145 }}
          >
            <ZoomableGroup
              zoom={1}
              center={[0, 15]}
              translateExtent={[[0, 0], [1000, 1000]]}
              disablePanning
              disableZooming
            >
              <Geographies geography={WORLD_TOPO}>
                {({ geographies }: any) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: landFill, stroke: landStroke, strokeWidth: 0.5, outline: "none" },
                        hover: { fill: landFill, stroke: landStroke, strokeWidth: 0.5, outline: "none" },
                        pressed: { fill: landFill, stroke: landStroke, strokeWidth: 0.5, outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {locations.map((loc) => {
                const lon = loc.longitude ?? NAME_TO_COORDS[loc.name]?.[0]
                const lat = loc.latitude ?? NAME_TO_COORDS[loc.name]?.[1]

                if (lon === undefined || lat === undefined) return null

                return (
                  <Marker key={loc.id} coordinates={[lon, lat]}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <g className="cursor-pointer">
                          <circle r={4} fill={markerFill} className="animate-pulse" />
                          <circle r={10} fill="none" stroke={markerFill} strokeOpacity={0.2} strokeWidth={2} />
                          <circle r={18} fill={markerFill} fillOpacity={0.05} />
                        </g>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background/95 backdrop-blur-md border-primary/20">
                        <div className="flex flex-col gap-1 p-1">
                          <p className="font-bold text-primary">{loc.name}</p>
                          {loc.description && (
                            <p className="text-xs text-muted-foreground max-w-[200px]">{loc.description}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">
                            {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </TooltipProvider>
  )
}
