import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Pitie-Salpetriere - Dashboard Hospitalier",
  description: "Tableau de bord interactif pour la simulation et la prevision des besoins hospitaliers",
}

export const viewport: Viewport = {
  themeColor: "#0f0f12",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  )
}
