"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, CartesianGrid } from "recharts"
import { Activity, Filter, RefreshCw, TrendingUp, Users, Calendar } from "lucide-react"

type EpidemicType = 'covid' | 'grippe' | 'bronchiolite' | 'ira'

interface ChartData {
  periode: string
  passages: number
  hospitalisations: number
  sosMedecins: number
}

interface FiltersData {
  regions: string[]
  departements: string[]
  classesAge: string[]
  annees: string[]
}

interface ApiResponse {
  data: ChartData[]
  filters: FiltersData
  totalRecords: number
}

const epidemicLabels: Record<EpidemicType, string> = {
  covid: 'COVID-19',
  grippe: 'Grippe',
  bronchiolite: 'Bronchiolite',
  ira: 'IRA',
}

const epidemicColors: Record<EpidemicType, string> = {
  covid: '#ef4444',
  grippe: '#f59e0b',
  bronchiolite: '#8b5cf6',
  ira: '#0ea5e9',
}

// Fallback data when API is not available
const fallbackData: Record<EpidemicType, ChartData[]> = {
  covid: [
    { periode: "Oct 2024", passages: 842, hospitalisations: 207, sosMedecins: 709 },
    { periode: "Nov 2024", passages: 1538, hospitalisations: 436, sosMedecins: 2116 },
    { periode: "Dec 2024", passages: 827, hospitalisations: 2786, sosMedecins: 2050 },
    { periode: "Jan 2025", passages: 1538, hospitalisations: 4360, sosMedecins: 2116 },
  ],
  grippe: [
    { periode: "Oct 2024", passages: 106, hospitalisations: 211, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 320, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 1299, hospitalisations: 645, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 5484, hospitalisations: 8000, sosMedecins: 0 },
  ],
  bronchiolite: [
    { periode: "Oct 2024", passages: 17798, hospitalisations: 31250, sosMedecins: 9040 },
    { periode: "Nov 2024", passages: 41808, hospitalisations: 61842, sosMedecins: 19137 },
    { periode: "Dec 2024", passages: 36537, hospitalisations: 54545, sosMedecins: 15646 },
    { periode: "Jan 2025", passages: 23237, hospitalisations: 37589, sosMedecins: 12632 },
  ],
  ira: [
    { periode: "Oct 2024", passages: 4339, hospitalisations: 9298, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 4149, hospitalisations: 17857, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 11513, hospitalisations: 29167, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 6889, hospitalisations: 12633, sosMedecins: 0 },
  ],
}

export function EpidemicChart() {
  const [selectedEpidemic, setSelectedEpidemic] = useState<EpidemicType>('bronchiolite')
  const [data, setData] = useState<ChartData[]>(fallbackData.bronchiolite)
  const [filters, setFilters] = useState<FiltersData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  
  // Filter selections
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedDept, setSelectedDept] = useState<string>("")
  const [selectedAge, setSelectedAge] = useState<string>("Tous âges")
  const [selectedYear, setSelectedYear] = useState<string>("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        disease: selectedEpidemic,
        region: selectedRegion,
        departement: selectedDept,
        classeAge: selectedAge,
        annee: selectedYear,
      })
      
      const response = await fetch(`/api/epidemic-data?${params}`)
      
      if (response.ok) {
        const result: ApiResponse = await response.json()
        if (result.data && result.data.length > 0) {
          setData(result.data)
          setFilters(result.filters)
          setTotalRecords(result.totalRecords)
        } else {
          setData(fallbackData[selectedEpidemic])
        }
      } else {
        setData(fallbackData[selectedEpidemic])
      }
    } catch {
      // Use fallback data if API fails
      setData(fallbackData[selectedEpidemic])
    } finally {
      setLoading(false)
    }
  }, [selectedEpidemic, selectedRegion, selectedDept, selectedAge, selectedYear])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = {
    maxPassages: Math.max(...data.map(d => d.passages)),
    maxHospit: Math.max(...data.map(d => d.hospitalisations)),
    avgPassages: Math.round(data.reduce((acc, d) => acc + d.passages, 0) / data.length),
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Tendances des Maladies Hivernales
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-1 h-3 w-3" />
                Filtres
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Disease selection */}
          <div className="flex flex-wrap gap-1">
            {(Object.keys(epidemicLabels) as EpidemicType[]).map((epidemic) => (
              <Button
                key={epidemic}
                variant={selectedEpidemic === epidemic ? "default" : "outline"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setSelectedEpidemic(epidemic)}
                style={{
                  backgroundColor: selectedEpidemic === epidemic ? epidemicColors[epidemic] : undefined,
                  borderColor: epidemicColors[epidemic],
                  color: selectedEpidemic === epidemic ? 'white' : epidemicColors[epidemic],
                }}
              >
                {epidemicLabels[epidemic]}
              </Button>
            ))}
          </div>

          {/* Filters panel */}
          {showFilters && filters && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Region</label>
                <select
                  className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">Toutes les regions</option>
                  {filters.regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Departement</label>
                <select
                  className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Tous les departements</option>
                  {filters.departements.slice(0, 50).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Classe d age</label>
                <select
                  className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                >
                  <option value="all">Toutes les classes</option>
                  {filters.classesAge.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Annee</label>
                <select
                  className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Toutes les annees</option>
                  {filters.annees.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Stats badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <TrendingUp className="h-3 w-3" />
              <span>Pic: {stats.maxPassages.toLocaleString()}/100k</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <Users className="h-3 w-3" />
              <span>Hospit max: {stats.maxHospit.toLocaleString()}/100k</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <Calendar className="h-3 w-3" />
              <span>Moy: {stats.avgPassages.toLocaleString()}/100k</span>
            </Badge>
            {totalRecords > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalRecords.toLocaleString()} enregistrements
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[320px]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorPassages-${selectedEpidemic}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={epidemicColors[selectedEpidemic]} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={epidemicColors[selectedEpidemic]} stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorHosp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="periode" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      passages: 'Passages urgences',
                      hospitalisations: 'Hospitalisations',
                      sosMedecins: 'Actes SOS Medecins'
                    }
                    return [value.toLocaleString() + ' /100k hab', labels[name] || name]
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend 
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      passages: 'Passages urgences',
                      hospitalisations: 'Hospitalisations',
                    }
                    return <span className="text-xs">{labels[value] || value}</span>
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="passages" 
                  stroke={epidemicColors[selectedEpidemic]} 
                  fillOpacity={1}
                  fill={`url(#colorPassages-${selectedEpidemic})`}
                  strokeWidth={2}
                  dot={{ r: 3, fill: epidemicColors[selectedEpidemic] }}
                  activeDot={{ r: 5 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hospitalisations" 
                  stroke="#0ea5e9" 
                  fillOpacity={1}
                  fill="url(#colorHosp)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0ea5e9' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            Donnees: Sante publique France - Taux pour 100 000 habitants
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedRegion || 'Toutes regions'} - {selectedYear || 'Toutes annees'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
