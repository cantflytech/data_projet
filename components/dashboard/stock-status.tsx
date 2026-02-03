"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { stockData } from "@/lib/hospital-data"
import { Package } from "lucide-react"

export function StockStatus() {
  const getStockStatus = (stockActuel: number | undefined, consoJour: number) => {
    if (!stockActuel) return { status: 'unknown', daysLeft: 0, percentage: 0 }
    const daysLeft = Math.round(stockActuel / consoJour)
    const percentage = Math.min(100, (stockActuel / (consoJour * 90)) * 100)
    if (daysLeft < 10) return { status: 'critical', daysLeft, percentage }
    if (daysLeft < 20) return { status: 'warning', daysLeft, percentage }
    return { status: 'normal', daysLeft, percentage }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive'
      case 'warning': return 'bg-[hsl(var(--warning))]'
      default: return 'bg-[hsl(var(--success))]'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Critique</Badge>
      case 'warning':
        return <Badge className="h-5 bg-[hsl(var(--warning))] px-1.5 text-[10px] text-[hsl(var(--warning-foreground))]">Alerte</Badge>
      default:
        return <Badge className="h-5 bg-[hsl(var(--success))] px-1.5 text-[10px] text-[hsl(var(--success-foreground))]">OK</Badge>
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Package className="h-4 w-4 text-primary" />
            Etat des stocks
          </CardTitle>
          <span className="text-xs text-muted-foreground">Mis a jour il y a 2h</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stockData.map((stock, index) => {
            const { status, daysLeft, percentage } = getStockStatus(stock.stockActuel, stock.consoJour)
            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{stock.sousType}</span>
                    {getStatusBadge(status)}
                  </div>
                  <span className="text-xs text-muted-foreground">{daysLeft}j restants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div 
                      className={`h-full transition-all ${
                        status === 'critical' 
                          ? 'bg-destructive' 
                          : status === 'warning' 
                            ? 'bg-[hsl(var(--warning))]' 
                            : 'bg-[hsl(var(--success))]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-muted-foreground">{Math.round(percentage)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
