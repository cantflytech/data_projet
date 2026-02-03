"use client"

import { Bed, Users, Package, TrendingUp, AlertTriangle, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { bedCapacityData, staffData, stockData } from "@/lib/hospital-data"

interface KPICardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  status?: 'normal' | 'warning' | 'critical'
}

function KPICard({ title, value, subtitle, icon, trend, status = 'normal' }: KPICardProps) {
  const statusColors = {
    normal: 'border-border',
    warning: 'border-[hsl(var(--warning))]/50',
    critical: 'border-destructive/50',
  }

  const trendColors = {
    normal: 'text-[hsl(var(--success))]',
    warning: 'text-[hsl(var(--warning))]',
    critical: 'text-destructive',
  }

  return (
    <Card className={`${statusColors[status]} bg-card`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${trendColors[status]}`}>
              <TrendingUp className="h-3 w-3" />
              <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const totalBeds = bedCapacityData.reduce((acc, s) => acc + s.litsExploitables, 0)
  const occupiedBeds = bedCapacityData.reduce((acc, s) => acc + Math.round(s.litsExploitables * (s.occupationActuelle || 0) / 100), 0)
  const avgOccupation = Math.round(occupiedBeds / totalBeds * 100)

  const totalStaff = staffData.find(s => s.indicateur === "Professionnels")?.valeur || 0
  const nurses = staffData.find(s => s.indicateur === "Infirmiers")?.valeur || 0

  const criticalStocks = stockData.filter(s => {
    if (!s.stockActuel) return false
    const daysLeft = s.stockActuel / s.consoJour
    return daysLeft < 20
  }).length

  const servicesInTension = bedCapacityData.filter(s => 
    s.occupationActuelle && s.occupationActuelle >= s.seuilTension
  ).length

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <KPICard
        title="Lits occupes"
        value={`${occupiedBeds}/${totalBeds}`}
        subtitle={`${avgOccupation}% d'occupation`}
        icon={<Bed className="h-5 w-5 text-primary" />}
        trend={{ value: 3, label: "vs hier" }}
        status={avgOccupation > 85 ? 'critical' : avgOccupation > 75 ? 'warning' : 'normal'}
      />
      <KPICard
        title="Personnel actif"
        value={totalStaff.toLocaleString()}
        subtitle={`dont ${nurses} infirmiers`}
        icon={<Users className="h-5 w-5 text-primary" />}
        status="normal"
      />
      <KPICard
        title="Services en tension"
        value={servicesInTension}
        subtitle={`sur ${bedCapacityData.length} services`}
        icon={<AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />}
        status={servicesInTension > 3 ? 'critical' : servicesInTension > 1 ? 'warning' : 'normal'}
      />
      <KPICard
        title="Stocks critiques"
        value={criticalStocks}
        subtitle={`articles a surveiller`}
        icon={<Package className="h-5 w-5 text-[hsl(var(--warning))]" />}
        status={criticalStocks > 2 ? 'critical' : criticalStocks > 0 ? 'warning' : 'normal'}
      />
      <KPICard
        title="Urgences"
        value="92%"
        subtitle="occupation actuelle"
        icon={<Activity className="h-5 w-5 text-destructive" />}
        trend={{ value: 8, label: "vs moyenne" }}
        status="critical"
      />
      <KPICard
        title="Population zone"
        value="177.7K"
        subtitle="habitants 13e arr."
        icon={<Users className="h-5 w-5 text-primary" />}
        status="normal"
      />
    </div>
  )
}
