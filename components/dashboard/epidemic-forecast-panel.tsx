"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { epidemicForecasts, riskCalendar } from "@/lib/epidemic-forecast"
import { AlertTriangle, TrendingUp, Calendar, Shield } from "lucide-react"

const intensityColors = {
  faible: "bg-green-100 text-green-800 border-green-200",
  modere: "bg-amber-100 text-amber-800 border-amber-200",
  fort: "bg-orange-100 text-orange-800 border-orange-200",
  severe: "bg-red-100 text-red-800 border-red-200"
}

const riskColors = {
  faible: "bg-green-50 border-l-green-500",
  modere: "bg-amber-50 border-l-amber-500",
  eleve: "bg-orange-50 border-l-orange-500",
  tres_eleve: "bg-red-50 border-l-red-500"
}

export function EpidemicForecastPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Previsions par maladie */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <TrendingUp className="h-5 w-5 text-primary" />
            Previsions Epidemiques 2025-2026
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {epidemicForecasts.map((forecast) => (
            <div 
              key={forecast.maladie}
              className="rounded-lg border bg-card p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{forecast.maladie}</h4>
                <Badge className={intensityColors[forecast.intensitePrevu]}>
                  {forecast.intensitePrevu.charAt(0).toUpperCase() + forecast.intensitePrevu.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Debut pic:</span>
                  <span className="ml-1 font-medium text-foreground">{forecast.debutPic}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fin:</span>
                  <span className="ml-1 font-medium text-foreground">{forecast.finPic}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pic max:</span>
                  <span className="ml-1 font-medium text-foreground">{forecast.picMaxPrevu}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confiance:</span>
                  <span className="ml-1 font-medium text-foreground">{forecast.confiance}%</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">Passages max prevus: <span className="font-semibold text-foreground">{forecast.tauxPassagesMax.toLocaleString()}/100k</span></p>
                <p className="text-muted-foreground">Hospitalisations max: <span className="font-semibold text-foreground">{forecast.tauxHospitalisationsMax.toLocaleString()}/100k</span></p>
              </div>

              {forecast.intensitePrevu === 'severe' || forecast.intensitePrevu === 'fort' ? (
                <div className="mt-2 p-2 rounded bg-red-50 border border-red-100">
                  <div className="flex items-center gap-1 text-red-700 text-xs font-medium mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    Actions recommandees
                  </div>
                  <ul className="text-xs text-red-600 space-y-0.5">
                    {forecast.recommandations.slice(0, 3).map((rec, idx) => (
                      <li key={idx}>- {rec}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Calendrier des risques */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            Calendrier des Risques Epidemiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {riskCalendar.map((month) => (
              <div
                key={month.mois}
                className={`p-2 rounded border-l-4 ${riskColors[month.risque as keyof typeof riskColors]}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{month.mois}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      month.risque === 'tres_eleve' ? 'border-red-500 text-red-700' :
                      month.risque === 'eleve' ? 'border-orange-500 text-orange-700' :
                      month.risque === 'modere' ? 'border-amber-500 text-amber-700' :
                      'border-green-500 text-green-700'
                    }`}
                  >
                    {month.risque.replace('_', ' ')}
                  </Badge>
                </div>
                {month.epidemies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {month.epidemies.map((epi, idx) => (
                      <span key={idx} className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                        {epi}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-primary font-medium text-sm mb-2">
              <Shield className="h-4 w-4" />
              Recommandation globale
            </div>
            <p className="text-xs text-muted-foreground">
              La periode novembre-fevrier concentre 80% de l activite epidemique. 
              Planifiez les ressources supplementaires et limitez les conges du personnel 
              soignant pendant cette periode critique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
