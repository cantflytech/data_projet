"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { predictionData } from "@/lib/hospital-data"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, Brain } from "lucide-react"

export function PredictionChart() {
  const data = predictionData.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
  }))

  const maxHospitalisations = Math.max(...predictionData.map(d => d.tauxHospitalisations))
  const trend = ((predictionData[predictionData.length - 1].tauxHospitalisations - predictionData[0].tauxHospitalisations) / predictionData[0].tauxHospitalisations * 100).toFixed(0)

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-medium">Previsions COVID-19</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Modele predictif sur 12 semaines
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 border-[hsl(var(--warning))]/50 text-[hsl(var(--warning))]">
            <TrendingUp className="h-3 w-3" />
            +{trend}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickMargin={8}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
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
                    tauxPassagesUrgences: 'Passages urgences',
                    tauxHospitalisations: 'Hospitalisations',
                    tauxActesSOS: 'Actes SOS Medecins'
                  }
                  return [value.toFixed(1), labels[name] || name]
                }}
              />
              <ReferenceLine y={400} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: 'Seuil alerte', fill: 'hsl(var(--warning))', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="tauxPassagesUrgences" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="tauxHospitalisations" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="tauxActesSOS" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="text-muted-foreground">Urgences</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded-full bg-[hsl(var(--chart-4))]" />
            <span className="text-muted-foreground">Hospitalisations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">SOS Medecins</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
