"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Calendar, Shield, RefreshCw, Play, FileCode } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts"
import test from "node:test"

interface ForecastData {
  date: string
  semaine: string
  mois_annee: string
  passages_prevu: number
  hospitalisations_prevu: number
  intervalle_bas: number
  intervalle_haut: number
  niveau_risque: string
  maladie: string
}

interface EpidemicPeriod {
  debut: string
  fin: string
  duree_semaines: number
  pic_passages: number
}

interface ForecastResponse {
  generated_at: string
  forecast_weeks: number
  region: string
  forecasts: Record<string, ForecastData[]>
  epidemic_history: Record<string, EpidemicPeriod[]>
}

type DiseaseType = 'covid' | 'grippe' | 'bronchiolite' | 'ira'

const diseaseLabels: Record<DiseaseType, string> = {
  covid: 'COVID-19',
  grippe: 'Grippe',
  bronchiolite: 'Bronchiolite',
  ira: 'IRA'
}

const diseaseColors: Record<DiseaseType, string> = {
  covid: '#ef4444',
  grippe: '#f59e0b',
  bronchiolite: '#8b5cf6',
  ira: '#0ea5e9'
}

const riskColors = {
  Faible: "bg-green-100 text-green-800 border-green-200",
  Moyen: "bg-amber-100 text-amber-800 border-amber-200",
  Eleve: "bg-red-100 text-red-800 border-red-200"
}

export function EpidemicForecastPanel() {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null)
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>('bronchiolite')
  const [loading, setLoading] = useState(false)
  const [generatedAt, setGeneratedAt] = useState<string>("")

  const fetchForecast = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/forecast')
      if (response.ok) {
        const data: ForecastResponse = await response.json()
        setForecastData(data)
        setGeneratedAt(new Date(data.generated_at).toLocaleString('fr-FR'))
      }
    } catch (error) {
      console.error('Error fetching forecast:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForecast()
  }, [])

  const currentForecast = forecastData?.forecasts[selectedDisease] || []
  const epidemicHistory = forecastData?.epidemic_history[selectedDisease] || []

  // Calculate summary stats
  const maxPassages = currentForecast.length > 0 
    ? Math.max(...currentForecast.map(f => f.passages_prevu)) 
    : 0
  const avgPassages = currentForecast.length > 0
    ? Math.round(currentForecast.reduce((acc, f) => acc + f.passages_prevu, 0) / currentForecast.length)
    : 0
  const highRiskWeeks = currentForecast.filter(f => f.niveau_risque === 'Eleve').length

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Main forecast chart */}
      <Card className="lg:col-span-2 bg-card border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-foreground">
                  Previsions Epidemiques - 12 Semaines
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={fetchForecast}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </div>
            
            {/* Disease selection */}
            <div className="flex flex-wrap gap-1">
              {(Object.keys(diseaseLabels) as DiseaseType[]).map((disease) => (
                <Button
                  key={disease}
                  variant={selectedDisease === disease ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => setSelectedDisease(disease)}
                  style={{
                    backgroundColor: selectedDisease === disease ? diseaseColors[disease] : undefined,
                    borderColor: diseaseColors[disease],
                    color: selectedDisease === disease ? 'white' : diseaseColors[disease],
                  }}
                >
                  {diseaseLabels[disease]}
                </Button>
              ))}
            </div>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">
                Pic prevu: {maxPassages.toLocaleString()}/100k
              </Badge>
              <Badge variant="outline" className="bg-background">
                Moyenne: {avgPassages.toLocaleString()}/100k
              </Badge>
              <Badge 
                variant={highRiskWeeks > 4 ? "destructive" : "secondary"}
              >
                {highRiskWeeks} semaines a risque eleve
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-[280px]">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={diseaseColors[selectedDisease]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={diseaseColors[selectedDisease]} stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorInterval" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={diseaseColors[selectedDisease]} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={diseaseColors[selectedDisease]} stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                  dataKey="semaine"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value, index) => {
                    const item = currentForecast[index];
                    return item ? `${item.semaine} ${item.mois_annee}` : value;
                  }}
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
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        passages_prevu: 'Passages prevus',
                        hospitalisations_prevu: 'Hospitalisations',
                        intervalle_haut: 'Intervalle haut',
                        intervalle_bas: 'Intervalle bas'
                      }
                      return [value.toLocaleString() + '/100k', labels[name] || name]
                    }}
                  />
                  <ReferenceLine 
                    y={10000} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ value: 'Seuil alerte', fill: '#ef4444', fontSize: 10 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="intervalle_haut" 
                    stroke="transparent"
                    fill="url(#colorInterval)"
                    stackId="interval"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="passages_prevu" 
                    stroke={diseaseColors[selectedDisease]} 
                    fill="url(#colorForecast)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: diseaseColors[selectedDisease] }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>Region: {forecastData?.region || 'Île-de-France'}</span>
            <span>Genere le: {generatedAt || '-'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Side panel with history and Python info */}
      <div className="space-y-4">
        {/* Historical epidemic periods */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Historique des Epidemies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {epidemicHistory.length > 0 ? (
              epidemicHistory.map((period, idx) => (
                <div 
                  key={idx}
                  className="rounded border border-border bg-muted/30 p-2 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{period.debut} - {period.fin}</span>
                    <Badge variant="outline" className="text-xs">
                      {period.duree_semaines} sem.
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    Pic: {period.pic_passages.toLocaleString()}/100k
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Aucune donnee historique</p>
            )}
          </CardContent>
        </Card>

        {/* Python script info */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileCode className="h-4 w-4 text-primary" />
              Script de Prevision Python
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Les previsions sont generees par un modele de moyenne mobile avec 
              ajustement saisonnier base sur les donnees historiques.
            </p>
            
            <div className="rounded bg-muted/50 p-2 text-xs font-mono">
              <code>python scripts/epidemic_forecast.py</code>
            </div>
            
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">Fichiers generes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>epidemic_forecast.json</li>
                <li>epidemic_forecast_combined.csv</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Executez le script pour actualiser les previsions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-primary" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs space-y-2 text-muted-foreground">
              {highRiskWeeks > 4 && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Augmenter les effectifs pendant les {highRiskWeeks} semaines critiques
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Limiter les conges du personnel soignant en periode de pic
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                Verifier les stocks de materiels et medicaments
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                Preparer les protocoles de surge capacity
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
