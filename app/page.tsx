"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { BedCapacityChart } from "@/components/dashboard/bed-capacity-chart"
import { EpidemicChart } from "@/components/dashboard/epidemic-chart"
import { PredictionChart } from "@/components/dashboard/prediction-chart"
import { StockStatus } from "@/components/dashboard/stock-status"
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel"
import { StaffOverview } from "@/components/dashboard/staff-overview"
import { SimulationPanel } from "@/components/dashboard/simulation-panel"
import { GeoInsights } from "@/components/dashboard/geo-insights"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BarChart3, Brain, Settings2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="epidemics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Epidemies</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Previsions</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Simulation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <KPICards />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <BedCapacityChart />
                <EpidemicChart />
              </div>
              <div className="space-y-6">
                <RecommendationsPanel />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StockStatus />
              <StaffOverview />
              <GeoInsights />
            </div>
          </TabsContent>

          <TabsContent value="epidemics" className="space-y-6">
            <KPICards />
            <div className="grid gap-6 lg:grid-cols-2">
              <EpidemicChart />
              <BedCapacityChart />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StockStatus />
              <StaffOverview />
              <GeoInsights />
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <KPICards />
            <div className="grid gap-6 lg:grid-cols-2">
              <PredictionChart />
              <RecommendationsPanel />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <EpidemicChart />
              <div className="lg:col-span-2">
                <BedCapacityChart />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <KPICards />
            <div className="grid gap-6 lg:grid-cols-2">
              <SimulationPanel />
              <RecommendationsPanel />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <BedCapacityChart />
              <StockStatus />
              <div className="space-y-6">
                <StaffOverview />
                <GeoInsights />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
