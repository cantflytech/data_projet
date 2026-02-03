export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Data Project
        </h1>
        <p className="text-lg text-muted-foreground">
          Healthcare data analysis and activity forecasting
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Geographic Data</h2>
            <p className="text-sm text-muted-foreground">
              Regional healthcare data for the 13th district
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Internal Data</h2>
            <p className="text-sm text-muted-foreground">
              Bed capacity, staffing figures, and stock levels
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Activity Peaks</h2>
            <p className="text-sm text-muted-foreground">
              Emergency visits for bronchiolitis, COVID-19, flu, and respiratory infections
            </p>
          </div>
        </div>
        <div className="mt-8 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Predictions</h2>
          <p className="text-sm text-muted-foreground">
            12-week COVID forecasting and activity analysis
          </p>
        </div>
      </div>
    </main>
  )
}
