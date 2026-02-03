"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { epidemicTrends } from "@/lib/hospital-data"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts"

type EpidemicType = 'covid' | 'grippe' | 'bronchiolite' | 'ira'

const epidemicLabels: Record<EpidemicType, string> = {
  covid: 'COVID-19',
  grippe: 'Grippe',
  bronchiolite: 'Bronchiolite',
  ira: 'IRA',
}

const epidemicColors: Record<EpidemicType, string> = {
  covid: 'hsl(var(--chart-4))',
  grippe: 'hsl(var(--chart-2))',
  bronchiolite: 'hsl(var(--chart-3))',
  ira: 'hsl(var(--chart-5))',
}

export function EpidemicChart() {
  const [selectedEpidemic, setSelectedEpidemic] = useState<EpidemicType>('bronchiolite')

  const data = epidemicTrends[selectedEpidemic]

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-medium">Suivi epidemiologique - Ile-de-France</CardTitle>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(epidemicTrends) as EpidemicType[]).map((epidemic) => (
              <Button
                key={epidemic}
                variant={selectedEpidemic === epidemic ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setSelectedEpidemic(epidemic)}
              >
                {epidemicLabels[epidemic]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPassages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={epidemicColors[selectedEpidemic]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={epidemicColors[selectedEpidemic]} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHosp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="periode" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    passages: 'Passages urgences',
                    hospitalisations: 'Hospitalisations',
                    sosMedecins: 'Actes SOS Medecins'
                  }
                  return [value.toLocaleString() + ' /100k', labels[name] || name]
                }}
              />
              <Legend 
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    passages: 'Passages urgences',
                    hospitalisations: 'Hospitalisations',
                  }
                  return <span className="text-xs text-muted-foreground">{labels[value] || value}</span>
                }}
              />
              <Area 
                type="monotone" 
                dataKey="passages" 
                stroke={epidemicColors[selectedEpidemic]} 
                fillOpacity={1}
                fill="url(#colorPassages)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="hospitalisations" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorHosp)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Donnees pour 100 000 habitants - Departement 75 (Paris)
        </div>
      </CardContent>
    </Card>
  )
}
