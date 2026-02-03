"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bedCapacityData } from "@/lib/hospital-data"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"

export function BedCapacityChart() {
  const data = bedCapacityData.map(service => ({
    name: service.service.length > 12 ? service.service.substring(0, 12) + '...' : service.service,
    fullName: service.service,
    occupation: service.occupationActuelle || 0,
    seuilTension: service.seuilTension,
    seuilSaturation: service.seuilSaturation,
    lits: service.litsExploitables,
  }))

  const getBarColor = (occupation: number, tension: number, saturation: number) => {
    if (occupation >= saturation) return 'hsl(var(--destructive))'
    if (occupation >= tension) return 'hsl(var(--warning))'
    return 'hsl(var(--primary))'
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Occupation des lits par service</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number, name: string, props: { payload: { fullName: string; lits: number; seuilTension: number; seuilSaturation: number } }) => {
                  const { fullName, lits, seuilTension, seuilSaturation } = props.payload
                  return [
                    <div key="tooltip" className="text-sm">
                      <p className="font-medium">{fullName}</p>
                      <p>Occupation: {value}%</p>
                      <p>Lits: {Math.round(lits * value / 100)} / {lits}</p>
                      <p className="text-[hsl(var(--warning))]">Seuil tension: {seuilTension}%</p>
                      <p className="text-destructive">Seuil saturation: {seuilSaturation}%</p>
                    </div>,
                    null
                  ]
                }}
                labelFormatter={() => ''}
              />
              <ReferenceLine x={80} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
              <ReferenceLine x={90} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Bar dataKey="occupation" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.occupation, entry.seuilTension, entry.seuilSaturation)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary" />
            <span className="text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[hsl(var(--warning))]" />
            <span className="text-muted-foreground">Tension</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Saturation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
