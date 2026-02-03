"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  vacationRequests, 
  staffAvailabilityByMonth, 
  vacationPolicy,
  staffRecommendations 
} from "@/lib/staff-vacations"
import { Users, Calendar, AlertTriangle, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const statusColors = {
  approuve: "bg-green-100 text-green-800 border-green-200",
  en_attente: "bg-amber-100 text-amber-800 border-amber-200",
  refuse: "bg-red-100 text-red-800 border-red-200",
  annule: "bg-gray-100 text-gray-800 border-gray-200"
}

const statusIcons = {
  approuve: CheckCircle,
  en_attente: Clock,
  refuse: XCircle,
  annule: XCircle
}

export function StaffVacationPanel() {
  const [showAllRequests, setShowAllRequests] = useState(false)
  
  // Prepare data for chart
  const chartData = staffAvailabilityByMonth
    .filter(d => d.service === "Urgences / UHCD")
    .map(d => ({
      mois: d.mois.slice(0, 3),
      disponible: d.tauxDisponibilite,
      epidemique: d.periodeEpidemique
    }))

  const displayedRequests = showAllRequests ? vacationRequests : vacationRequests.slice(0, 5)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Disponibilite du personnel */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Users className="h-5 w-5 text-primary" />
            Disponibilite Personnel - Urgences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="mois" 
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[70, 100]} 
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Disponibilite']}
                />
                <Bar dataKey="disponible" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.epidemique ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span>Periode epidemique</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-muted-foreground"></div>
              <span>Periode normale</span>
            </div>
          </div>

          {/* Periodes bloquees */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-2">
              <AlertTriangle className="h-4 w-4" />
              Periodes de conges restreintes
            </div>
            <ul className="text-xs text-red-600 space-y-1">
              {vacationPolicy.periodeBloquee.map((blocked, idx) => (
                <li key={idx}>
                  <span className="font-medium">{blocked.debut} - {blocked.fin}:</span> {blocked.raison}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Demandes de conges */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            Demandes de Conges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {displayedRequests.map((request) => {
              const StatusIcon = statusIcons[request.statut]
              return (
                <div 
                  key={request.id}
                  className="p-2 rounded-lg border bg-card hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${
                        request.statut === 'approuve' ? 'text-green-600' :
                        request.statut === 'refuse' ? 'text-red-600' :
                        'text-amber-600'
                      }`} />
                      <span className="font-medium text-sm text-foreground">{request.employe}</span>
                    </div>
                    <Badge className={statusColors[request.statut]}>
                      {request.statut.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground ml-6">
                    <p>{request.service} - {request.categorie}</p>
                    <p>Du {new Date(request.dateDebut).toLocaleDateString('fr-FR')} au {new Date(request.dateFin).toLocaleDateString('fr-FR')}</p>
                    {request.raisonRefus && (
                      <p className="text-red-600 mt-1">Motif: {request.raisonRefus}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {vacationRequests.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowAllRequests(!showAllRequests)}
            >
              {showAllRequests ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Voir tout ({vacationRequests.length})
                </>
              )}
            </Button>
          )}

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {vacationRequests.filter(r => r.statut === 'approuve').length}
              </div>
              <div className="text-xs text-muted-foreground">Approuves</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">
                {vacationRequests.filter(r => r.statut === 'en_attente').length}
              </div>
              <div className="text-xs text-muted-foreground">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {vacationRequests.filter(r => r.statut === 'refuse').length}
              </div>
              <div className="text-xs text-muted-foreground">Refuses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
