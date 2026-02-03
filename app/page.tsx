"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-secondary">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="epidemics">Epidemies</TabsTrigger>
            <TabsTrigger value="predictions">Previsions</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <KPICards />
            
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BedCapacityChart />
              </div>
              <div>
                <RecommendationsPanel />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <StockStatus />
              <StaffOverview />
            </div>

            <GeoInsights />
          </TabsContent>

          <TabsContent value="epidemics" className="space-y-6">
            <EpidemicChart />
            <div className="grid gap-6 lg:grid-cols-2">
              <RecommendationsPanel />
              <StockStatus />
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <PredictionChart />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BedCapacityChart />
              </div>
              <RecommendationsPanel />
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <SimulationPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
