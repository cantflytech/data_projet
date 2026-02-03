"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, Play, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { bedCapacityData } from "@/lib/hospital-data"

export function SimulationPanel() {
  const [epidemicIncrease, setEpidemicIncrease] = useState([0])
  const [staffReduction, setStaffReduction] = useState([0])
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState<{
    bedsNeeded: number
    nursesNeeded: number
    daysToSaturation: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  } | null>(null)

  const runSimulation = () => {
    setIsSimulating(true)
    
    // Simulate calculation
    setTimeout(() => {
      const baseOccupation = bedCapacityData.reduce((acc, s) => acc + (s.occupationActuelle || 0), 0) / bedCapacityData.length
      const newOccupation = baseOccupation + epidemicIncrease[0] * 0.5
      const effectiveStaff = 100 - staffReduction[0]
      
      const bedsNeeded = Math.round(epidemicIncrease[0] * 8.5)
      const nursesNeeded = Math.round(bedsNeeded / 6)
      const daysToSaturation = Math.max(1, Math.round(30 - epidemicIncrease[0] * 0.5 - staffReduction[0] * 0.3))
      
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
      if (newOccupation > 95 || effectiveStaff < 70) riskLevel = 'critical'
      else if (newOccupation > 85 || effectiveStaff < 80) riskLevel = 'high'
      else if (newOccupation > 75 || effectiveStaff < 90) riskLevel = 'medium'
      
      setResults({ bedsNeeded, nursesNeeded, daysToSaturation, riskLevel })
      setIsSimulating(false)
    }, 1000)
  }

  const resetSimulation = () => {
    setEpidemicIncrease([0])
    setStaffReduction([0])
    setResults(null)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]'
      case 'medium': return 'bg-[hsl(var(--chart-2))] text-[hsl(var(--warning-foreground))]'
      default: return 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'critical': return 'Critique'
      case 'high': return 'Eleve'
      case 'medium': return 'Modere'
      default: return 'Faible'
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Calculator className="h-4 w-4 text-primary" />
          Simulateur de scenarios
        </CardTitle>
        <CardDescription>
          Anticipez l'impact de differents scenarios sur les ressources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Augmentation epidemique</Label>
              <span className="text-sm font-medium text-primary">+{epidemicIncrease[0]}%</span>
            </div>
            <Slider
              value={epidemicIncrease}
              onValueChange={setEpidemicIncrease}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Simule une hausse des admissions liee a une epidemie
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Reduction du personnel</Label>
              <span className="text-sm font-medium text-[hsl(var(--warning))]">-{staffReduction[0]}%</span>
            </div>
            <Slider
              value={staffReduction}
              onValueChange={setStaffReduction}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Simule une reduction du personnel (maladie, greve, etc.)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={runSimulation} 
            disabled={isSimulating}
            className="flex-1"
          >
            {isSimulating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isSimulating ? 'Simulation...' : 'Lancer la simulation'}
          </Button>
          <Button variant="outline" onClick={resetSimulation}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {results && (
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resultat de la simulation</span>
              <Badge className={getRiskColor(results.riskLevel)}>
                Risque {getRiskLabel(results.riskLevel)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-background/50 p-2 text-center">
                <p className="text-lg font-bold text-foreground">{results.bedsNeeded}</p>
                <p className="text-xs text-muted-foreground">Lits supplementaires</p>
              </div>
              <div className="rounded-md bg-background/50 p-2 text-center">
                <p className="text-lg font-bold text-foreground">{results.nursesNeeded}</p>
                <p className="text-xs text-muted-foreground">Infirmiers requis</p>
              </div>
              <div className="rounded-md bg-background/50 p-2 text-center">
                <p className="text-lg font-bold text-foreground">{results.daysToSaturation}j</p>
                <p className="text-xs text-muted-foreground">Avant saturation</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>Actions recommandees:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {results.bedsNeeded > 0 && <li>Activer {results.bedsNeeded} lits supplementaires</li>}
                {results.nursesNeeded > 0 && <li>Recruter {results.nursesNeeded} infirmiers temporaires</li>}
                {results.riskLevel === 'critical' && <li>Declencher le plan blanc</li>}
                {results.riskLevel === 'high' && <li>Alerter les services partenaires</li>}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
