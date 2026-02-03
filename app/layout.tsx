import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Pitie-Salpetriere - Dashboard Hospitalier",
  description: "Tableau de bord interactif pour la simulation et prevision des besoins hospitaliers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  )
}
