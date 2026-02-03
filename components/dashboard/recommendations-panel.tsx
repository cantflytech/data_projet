"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateRecommendations } from "@/lib/hospital-data"
import { Lightbulb, AlertTriangle, AlertCircle, Info, ChevronRight, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecommendationsPanel() {
  const recommendations = generateRecommendations()

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-destructive'
      case 'warning':
        return 'border-l-[hsl(var(--warning))]'
      default:
        return 'border-l-primary'
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Capacite': 'bg-[hsl(var(--chart-5))]/20 text-[hsl(var(--chart-5))]',
      'Stock': 'bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]',
      'Epidemie': 'bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))]',
      'Prevision': 'bg-primary/20 text-primary',
    }
    return colors[category] || 'bg-secondary text-secondary-foreground'
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Recommandations automatiques
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {recommendations.length} actives
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4 pt-0">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`rounded-lg border border-l-4 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50 ${getBorderColor(rec.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(rec.type)}</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{rec.title}</span>
                      <Badge className={`h-5 px-1.5 text-[10px] ${getCategoryBadge(rec.category)}`}>
                        {rec.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                    <div className="rounded-md bg-background/50 p-2">
                      <p className="text-xs font-medium text-foreground">Action recommandee:</p>
                      <p className="text-xs text-muted-foreground">{rec.action}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-primary">{rec.impact}</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Details <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
