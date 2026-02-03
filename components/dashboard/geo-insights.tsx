"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { geoData } from "@/lib/hospital-data"
import { MapPin, Users, Home, Briefcase, TrendingDown } from "lucide-react"

export function GeoInsights() {
  const population = geoData.find(d => d.indicateur === "Population totale")?.valeur || 0
  const density = geoData.find(d => d.indicateur === "Densite de population")?.valeur || 0
  const povertyRate = geoData.find(d => d.indicateur === "Taux de pauvrete")?.valeur || 0
  const unemploymentRate = geoData.find(d => d.indicateur === "Taux de chomage 15-64 ans")?.valeur || 0
  const births = geoData.find(d => d.indicateur === "Naissances domiciliees")?.valeur || 0
  const deaths = geoData.find(d => d.indicateur === "Deces domicilies")?.valeur || 0

  const insights = [
    {
      icon: <Users className="h-4 w-4 text-primary" />,
      label: "Population",
      value: population.toLocaleString(),
      subtitle: "habitants",
    },
    {
      icon: <MapPin className="h-4 w-4 text-[hsl(var(--chart-2))]" />,
      label: "Densite",
      value: density.toLocaleString(),
      subtitle: "hab/km2",
    },
    {
      icon: <Home className="h-4 w-4 text-[hsl(var(--chart-3))]" />,
      label: "Taux pauvrete",
      value: `${povertyRate}%`,
      subtitle: "de la population",
    },
    {
      icon: <Briefcase className="h-4 w-4 text-[hsl(var(--chart-5))]" />,
      label: "Chomage",
      value: `${unemploymentRate}%`,
      subtitle: "15-64 ans",
    },
  ]

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          Zone de desserte - Paris 13e
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, index) => (
            <div key={index} className="rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-2">
                {insight.icon}
                <span className="text-xs text-muted-foreground">{insight.label}</span>
              </div>
              <p className="mt-1 text-lg font-bold text-foreground">{insight.value}</p>
              <p className="text-xs text-muted-foreground">{insight.subtitle}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Solde naturel 2024</span>
            <div className="flex items-center gap-1 text-[hsl(var(--success))]">
              <TrendingDown className="h-3 w-3 rotate-180" />
              <span className="text-sm font-medium">+{births - deaths}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Naissances: {births.toLocaleString()}</span>
            <span>Deces: {deaths.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
