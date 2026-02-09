"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, Play, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Clock } from "lucide-react"
import { bedCapacityData } from "@/lib/hospital-data"
import { Progress } from "@/components/ui/progress"

type RiskLevel = "low" | "medium" | "high" | "critical"

type SimulationResult = {
  bedsNeeded: number
  nursesNeeded: number
  daysToSaturation: number | null
  riskLevel: RiskLevel
  projectedOccupationRate: number
  staffCoverage: number
  pressureIndex: number
  recommendations: string[]
  scenarioLabel?: string
  effectiveBedCapacity: number
  surgeBeds: number
  peakDays: number
  extraCapacityPct: number
  staffReductionPct: number
  epidemicIncreasePct: number
}

type ScenarioPreset = {
  id: string
  label: string
  description: string
  epidemicIncrease: number
  staffReduction: number
  peakDuration: number
  extraCapacity: number
}

const scenarioPresets: ScenarioPreset[] = [
  {
    id: "winter-surge",
    label: "Pic grippe modéré",
    description: "Admissions +25%, effectifs -8% sur 2 semaines",
    epidemicIncrease: 25,
    staffReduction: 8,
    peakDuration: 14,
    extraCapacity: 5,
  },
  {
    id: "covid-wave",
    label: "Vague COVID",
    description: "Admissions +45%, effectifs -12% sur 3 semaines",
    epidemicIncrease: 45,
    staffReduction: 12,
    peakDuration: 21,
    extraCapacity: 10,
  },
  {
    id: "pediatric-stress",
    label: "Bronchiolite pédiatrique",
    description: "Admissions +60%, effectifs -5% sur 10 jours",
    epidemicIncrease: 60,
    staffReduction: 5,
    peakDuration: 10,
    extraCapacity: 8,
  },
]

export function SimulationPanel() {
  const capacityMetrics = useMemo(() => {
    const totalBeds = bedCapacityData.reduce((sum, service) => sum + (service.litsExploitables ?? service.litsTheoriques ?? 0), 0)
    const totalInfirmiers = bedCapacityData.reduce((sum, service) => sum + (service.infirmiersRequis ?? 0), 0)
    const baselineOccupiedBeds = bedCapacityData.reduce((sum, service) => {
      const beds = service.litsExploitables ?? service.litsTheoriques ?? 0
      const occupation = service.occupationActuelle ?? 0
      return sum + beds * (occupation / 100)
    }, 0)

    const baselineOccupationRate = totalBeds > 0 ? (baselineOccupiedBeds / totalBeds) * 100 : 0

    return {
      totalBeds,
      totalInfirmiers,
      baselineOccupiedBeds,
      baselineOccupationRate,
    }
  }, [])

  const [epidemicIncrease, setEpidemicIncrease] = useState([0])
  const [staffReduction, setStaffReduction] = useState([0])
  const [peakDuration, setPeakDuration] = useState([14])
  const [extraCapacity, setExtraCapacity] = useState([0])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState<SimulationResult | null>(null)

  const applyPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset.id)
    setEpidemicIncrease([preset.epidemicIncrease])
    setStaffReduction([preset.staffReduction])
    setPeakDuration([preset.peakDuration])
    setExtraCapacity([preset.extraCapacity])
    setResults(null)
  }

  const runSimulation = () => {
    const { totalBeds, totalInfirmiers, baselineOccupiedBeds } = capacityMetrics
    setIsSimulating(true)

    window.setTimeout(() => {
      const epidemicDelta = (epidemicIncrease[0] ?? 0) / 100
      const staffDelta = (staffReduction[0] ?? 0) / 100
      const extraCapacityDelta = (extraCapacity[0] ?? 0) / 100
      const peakDays = Math.max(1, peakDuration[0] ?? 1)

      const effectiveTotalBeds = totalBeds * (1 + extraCapacityDelta)
      const projectedOccupiedBeds = baselineOccupiedBeds * (1 + epidemicDelta)
      const surgeBeds = Math.max(0, projectedOccupiedBeds - baselineOccupiedBeds)
      const projectedOccupationRate = effectiveTotalBeds > 0 ? (projectedOccupiedBeds / effectiveTotalBeds) * 100 : 0
      const bedsNeeded = Math.max(0, Math.round(projectedOccupiedBeds - effectiveTotalBeds))
      const availableBeds = Math.max(0, effectiveTotalBeds - baselineOccupiedBeds)
      const admissionsPerDay = surgeBeds > 0 ? surgeBeds / peakDays : 0
      const daysToSaturation = bedsNeeded > 0 && admissionsPerDay > 0
        ? Math.max(1, Math.round(availableBeds / admissionsPerDay))
        : null

      const staffLoad = 1 + epidemicDelta * 0.6
      const staffCoverage = Math.max(0, Math.min(130, ((1 - staffDelta) / staffLoad) * 100))
      const nursesNeeded = Math.max(
        0,
        Math.round((totalInfirmiers * staffDelta) + (bedsNeeded > 0 ? bedsNeeded / 5 : 0))
      )

      const pressureIndex = Math.round(
        projectedOccupationRate * 0.6 +
        (100 - staffCoverage) * 0.35 +
        (peakDays / 30) * 15 +
        (bedsNeeded > 0 ? 10 : 0)
      )

      let riskLevel: RiskLevel = "low"
      if (pressureIndex >= 165 || projectedOccupationRate >= 110 || staffCoverage < 60) {
        riskLevel = "critical"
      } else if (pressureIndex >= 135 || projectedOccupationRate >= 95 || staffCoverage < 75) {
        riskLevel = "high"
      } else if (pressureIndex >= 110 || projectedOccupationRate >= 85 || staffCoverage < 85) {
        riskLevel = "medium"
      }

      const recommendations: string[] = []
      if (bedsNeeded > 0) {
        recommendations.push(`Prévoir l'ouverture ou le transfert de ${bedsNeeded} lits supplémentaires.`)
      }
      if (staffCoverage < 85) {
        const staffGap = Math.max(5, Math.round(totalInfirmiers * Math.max(0, (85 - staffCoverage) / 100)))
        recommendations.push(`Programmer le rappel ou la mutualisation de ${staffGap} infirmiers.`)
      }
      if (peakDays >= 18) {
        recommendations.push(`Anticiper une mobilisation longue de ${peakDays} jours (renforts et repos décalés).`)
      }
      if (riskLevel === "critical") {
        recommendations.push("Déclencher le plan blanc et coordonner les transferts inter-établissements.")
      } else if (riskLevel === "high") {
        recommendations.push("Activer la cellule de crise quotidienne avec revue des lits critiques.")
      }
      if (extraCapacityDelta === 0 && bedsNeeded > 0) {
        recommendations.push("Identifier des lits libérables via la déprogrammation contrôlée.")
      }
      if (recommendations.length === 0) {
        recommendations.push("Situation maîtrisable : maintenir la veille renforcée et ajuster quotidiennement.")
      }

      const scenarioLabel = selectedPreset
        ? scenarioPresets.find((preset) => preset.id === selectedPreset)?.label
        : undefined

      setResults({
        bedsNeeded,
        nursesNeeded,
        daysToSaturation,
        riskLevel,
        projectedOccupationRate,
        staffCoverage,
        pressureIndex,
        recommendations,
        scenarioLabel,
        effectiveBedCapacity: Math.round(effectiveTotalBeds),
        surgeBeds: Math.round(surgeBeds),
        peakDays,
        extraCapacityPct: extraCapacity[0] ?? 0,
        staffReductionPct: staffReduction[0] ?? 0,
        epidemicIncreasePct: epidemicIncrease[0] ?? 0,
      })
      setIsSimulating(false)
    }, 700)
  }

  const resetSimulation = () => {
    setEpidemicIncrease([0])
    setStaffReduction([0])
    setPeakDuration([14])
    setExtraCapacity([0])
    setSelectedPreset(null)
    setResults(null)
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]'
      case 'medium': return 'bg-[hsl(var(--chart-2))] text-[hsl(var(--warning-foreground))]'
      default: return 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'
    }
  }

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical': return 'Critique'
      case 'high': return 'Élevé'
      case 'medium': return 'Modéré'
      default: return 'Faible'
    }
  }

  const getRiskTone = (risk: RiskLevel) => {
    switch (risk) {
      case "critical":
        return "hsl(var(--destructive))"
      case "high":
        return "hsl(var(--warning))"
      case "medium":
        return "hsl(var(--chart-2))"
      default:
        return "hsl(var(--success))"
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
        <div className="space-y-5">
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Scénarios rapides</Label>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {scenarioPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={selectedPreset === preset.id ? "default" : "outline"}
                  className="h-auto justify-start gap-2 rounded-lg border-border bg-background/60 py-3 px-3 text-left"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{preset.label}</span>
                    <span className="text-xs text-muted-foreground">{preset.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Augmentation épidémique</Label>
                <span className="text-sm font-medium text-primary">+{epidemicIncrease[0]}%</span>
              </div>
              <Slider
                value={epidemicIncrease}
                onValueChange={(value) => {
                  setSelectedPreset(null)
                  setEpidemicIncrease(value)
                }}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Variation des admissions liées à l'épidémie par rapport au niveau actuel.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Réduction du personnel</Label>
                <span className="text-sm font-medium text-[hsl(var(--warning))]">-{staffReduction[0]}%</span>
              </div>
              <Slider
                value={staffReduction}
                onValueChange={(value) => {
                  setSelectedPreset(null)
                  setStaffReduction(value)
                }}
                max={50}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Personnel indisponible (maladie, congés, grève, formation, etc.).
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Durée du pic</Label>
                <span className="text-sm font-medium text-muted-foreground">{peakDuration[0]} jours</span>
              </div>
              <Slider
                value={peakDuration}
                onValueChange={(value) => {
                  setSelectedPreset(null)
                  setPeakDuration(value)
                }}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Nombre de jours pendant lesquels la pression reste élevée.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Capacité additionnelle mobilisable</Label>
                <span className="text-sm font-medium text-[hsl(var(--success))]">+{extraCapacity[0]}%</span>
              </div>
              <Slider
                value={extraCapacity}
                onValueChange={(value) => {
                  setSelectedPreset(null)
                  setExtraCapacity(value)
                }}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Capacité de lits supplémentaires via déprogrammation ou renforts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="flex-1 min-w-[200px]"
          >
            {isSimulating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isSimulating ? "Simulation..." : "Lancer la simulation"}
          </Button>
          <Button variant="outline" onClick={resetSimulation} className="flex-none">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {results && (
          <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-sm font-medium">Résultat de la simulation</span>
                <p className="text-xs text-muted-foreground">
                  {results.scenarioLabel ?? "Scénario personnalisé"} · Admissions +{results.epidemicIncreasePct}% · Pic {results.peakDays} j · Capacité +{results.extraCapacityPct}% · Staff -{results.staffReductionPct}%
                </p>
              </div>
              <Badge className={getRiskColor(results.riskLevel)}>
                Risque {getRiskLabel(results.riskLevel)}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-background/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Occupation projetée
                  </div>
                  <span className="text-sm font-semibold">
                    {results.projectedOccupationRate.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(100, results.projectedOccupationRate)}
                  className="mt-2"
                  style={{ "--progress-background": getRiskTone(results.riskLevel) } as CSSProperties}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Capacité mobilisée : {results.effectiveBedCapacity.toLocaleString("fr-FR")} lits
                </p>
              </div>

              <div className="rounded-md bg-background/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    Couverture soignante
                  </div>
                  <span className="text-sm font-semibold">
                    {results.staffCoverage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.max(0, Math.min(100, results.staffCoverage))}
                  className="mt-2"
                  style={{
                    "--progress-background":
                      results.staffCoverage >= 90
                        ? "hsl(var(--success))"
                        : results.staffCoverage >= 80
                          ? "hsl(var(--chart-2))"
                          : "hsl(var(--warning))",
                  } as CSSProperties}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Infirmiers indisponibles : {Math.round(capacityMetrics.totalInfirmiers * (results.staffReductionPct / 100)).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                  <Calculator className="h-3 w-3" />
                  Lits à mobiliser
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">{results.bedsNeeded.toLocaleString("fr-FR")}</p>
                <p className="text-xs text-muted-foreground">Surplus attendu : +{results.surgeBeds.toLocaleString("fr-FR")} lits</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  Renforts soignants
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">{results.nursesNeeded.toLocaleString("fr-FR")}</p>
                <p className="text-xs text-muted-foreground">Infirmiers temporaires nécessaires</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Jours avant saturation
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {results.daysToSaturation ? `${results.daysToSaturation} j` : `≥ ${results.peakDays} j`}
                </p>
                <p className="text-xs text-muted-foreground">Avec admissions de {Math.max(0, Math.round(results.surgeBeds / results.peakDays)).toLocaleString("fr-FR")} lits/jour</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Indice de pression
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">{results.pressureIndex}</p>
                <p className="text-xs text-muted-foreground">&gt; 165 : déclenchement plan blanc</p>
              </div>
            </div>

            <div className="pt-1 text-xs text-muted-foreground">
              <p>Actions recommandées :</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                {results.recommendations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
