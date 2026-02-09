"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"
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

const MONTH_ORDER = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"] as const

const MONTH_FULL_NAMES: Record<string, string> = {
  Jan: "Janvier",
  Fev: "Février",
  Mar: "Mars",
  Avr: "Avril",
  Mai: "Mai",
  Juin: "Juin",
  Juil: "Juillet",
  Aout: "Août",
  Sep: "Septembre",
  Oct: "Octobre",
  Nov: "Novembre",
  Dec: "Décembre",
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
  const { overlayData, years } = useMemo(() => {
    if (!data || data.length === 0) {
      return { overlayData: [] as Array<Record<string, number | string | null>>, years: [] as string[] }
    }

    const yearBuckets = new Map<string, Map<string, number>>()
    const monthsSet = new Set<string>()

    data.forEach((entry) => {
      const [monthLabel, yearLabel] = entry.periode.split(" ")
      if (!monthLabel || !yearLabel) return

      monthsSet.add(monthLabel)

      if (!yearBuckets.has(yearLabel)) {
        yearBuckets.set(yearLabel, new Map())
      }

      yearBuckets.get(yearLabel)!.set(monthLabel, entry.hospitalisations)
    })

    const sortedYears = Array.from(yearBuckets.keys()).sort((a, b) => {
      const numA = Number(a)
      const numB = Number(b)

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numB - numA
      }

      return b.localeCompare(a)
    })

    const sortedMonths = Array.from(monthsSet)
      .map((month) => ({
        month,
        index: MONTH_ORDER.indexOf(month as typeof MONTH_ORDER[number]),
      }))
      .sort((a, b) => {
        const aIndex = a.index === -1 ? 99 : a.index
        const bIndex = b.index === -1 ? 99 : b.index

        if (aIndex === bIndex) {
          return a.month.localeCompare(b.month)
        }

        return aIndex - bIndex
      })
      .map((entry) => entry.month)

    const composed = sortedMonths.map((monthLabel) => {
      const row: Record<string, number | string | null> = { month: monthLabel }

      sortedYears.forEach((yearLabel) => {
        const value = yearBuckets.get(yearLabel)?.get(monthLabel)
        row[yearLabel] = typeof value === "number" && !Number.isNaN(value) ? Math.round(value) : null
      })

      return row
    })

    return {
      overlayData: composed,
      years: sortedYears,
    }
  }, [data])

  const hospitalValues = useMemo(
    () =>
      data
        .map((entry) => entry.hospitalisations)
        .filter((value): value is number => typeof value === "number" && !Number.isNaN(value)),
    [data]
  )

  const maxHospit = hospitalValues.length ? Math.max(...hospitalValues) : 0
  const avgHospit = hospitalValues.length
    ? Math.round(hospitalValues.reduce((acc, value) => acc + value, 0) / hospitalValues.length)
    : 0

  const yearBadgeLabel = years.length
    ? [...years].sort((a, b) => a.localeCompare(b)).join(" · ")
    : selectedYear || "N/A"

  const colorPalette = [
    epidemicColors[selectedEpidemic],
    "#0ea5e9",
    "#f97316",
    "#22c55e",
    "#a855f7",
    "#facc15",
    "#ef4444",
    "#14b8a6",
  ]

  const lineColors = years.reduce<Record<string, string>>((acc, year, index) => {
    acc[year] = colorPalette[index % colorPalette.length]
    return acc
  }, {})

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
              <span>Pic hospit: {maxHospit.toLocaleString("fr-FR")}/100k</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <Users className="h-3 w-3" />
              <span>Moyenne: {avgHospit.toLocaleString("fr-FR")}/100k</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <Calendar className="h-3 w-3" />
              <span>Années: {yearBadgeLabel}</span>
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
          ) : overlayData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Aucune donnée hospitalière à afficher pour cette sélection.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overlayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => (value >= 1000 ? `${Math.round(value / 1000)}k` : value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number | string | null, name: string) => {
                    const numericValue = typeof value === 'number' ? value : Number(value)
                    if (!Number.isFinite(numericValue)) {
                      return ['-', `Année ${name}`]
                    }
                    return [`${numericValue.toLocaleString('fr-FR')} /100k hab`, `Année ${name}`]
                  }}
                  labelFormatter={(label) => MONTH_FULL_NAMES[label as string] || label}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs">Année {value}</span>}
                />
                {years.map((year) => (
                  <Line
                    key={year}
                    type="monotone"
                    dataKey={year}
                    stroke={lineColors[year] ?? epidemicColors[selectedEpidemic]}
                    strokeWidth={3}
                    dot={{ r: 3, fill: lineColors[year] ?? epidemicColors[selectedEpidemic] }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
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
