"use server"

import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface EpidemicRecord {
  date: string
  semaine: string
  departementCode: string
  departement: string
  classeAge: string
  tauxPassages: number
  tauxHospitalisations: number
  tauxSosMedecins: number
  regionCode: string
  region: string
}

function parseCSV(content: string, diseaseType: string): EpidemicRecord[] {
  const lines = content.split("\n")
  const records: EpidemicRecord[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = line.split(",")
    if (values.length < 10) continue
    
    const tauxPassages = parseFloat(values[5]) || 0
    const tauxHospitalisations = parseFloat(values[6]) || 0
    const tauxSosMedecins = parseFloat(values[7]) || 0
    
    records.push({
      date: values[0],
      semaine: values[1],
      departementCode: values[2],
      departement: values[3],
      classeAge: values[4],
      tauxPassages,
      tauxHospitalisations,
      tauxSosMedecins,
      regionCode: diseaseType === "grippe" ? values[9] : values[8],
      region: diseaseType === "grippe" ? values[8] : values[9],
    })
  }
  
  return records
}

function formatDateToMonthYear(dateStr: string): string {
  const date = new Date(dateStr)
  const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const disease = searchParams.get("disease") || "covid"
    const region = searchParams.get("region") || ""
    const departement = searchParams.get("departement") || ""
    const classeAge = searchParams.get("classeAge") || "Tous âges"
    const annee = searchParams.get("annee") || ""
    
    const fileMap: Record<string, string> = {
      covid: "Final_data/pics_activité/covid-19-passages-aux-urgences-et-actes-sos-medecins-departement.csv",
      grippe: "Final_data/pics_activité/grippe-passages-aux-urgences-et-actes-sos-medecins-departement.csv",
      bronchiolite: "Final_data/pics_activité/bronchiolite-passages-aux-urgences-et-actes-sos-medecins-departement.csv",
      ira: "Final_data/pics_activité/infections-respiratoires-aigues-ira-passages-aux-urgences-et-actes-sos-medecins-departement.csv",
    }
    
    const filePath = path.join(process.cwd(), fileMap[disease] || fileMap.covid)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Fichier non trouve" }, { status: 404 })
    }
    
    const content = fs.readFileSync(filePath, "utf-8")
    let records = parseCSV(content, disease)
    
    // Apply filters
    if (region) {
      records = records.filter(r => r.region.toLowerCase().includes(region.toLowerCase()))
    }
    if (departement) {
      records = records.filter(r => 
        r.departement.toLowerCase().includes(departement.toLowerCase()) ||
        r.departementCode === departement
      )
    }
    if (classeAge && classeAge !== "all") {
      records = records.filter(r => r.classeAge === classeAge)
    }
    if (annee) {
      records = records.filter(r => r.date.startsWith(annee))
    }
    
    // Get unique values for filters
    const allRecords = parseCSV(content, disease)
    const regions = [...new Set(allRecords.map(r => r.region).filter(Boolean))].sort()
    const departements = [...new Set(allRecords.map(r => r.departement).filter(Boolean))].sort()
    const classesAge = [...new Set(allRecords.map(r => r.classeAge).filter(Boolean))].sort()
    const annees = [...new Set(allRecords.map(r => r.date.substring(0, 4)).filter(Boolean))].sort()
    
    // Aggregate data by month/year
    const aggregatedData: Record<string, { 
      periode: string
      passages: number
      hospitalisations: number
      sosMedecins: number
      count: number 
    }> = {}
    
    records.forEach(record => {
      const periode = formatDateToMonthYear(record.date)
      if (!aggregatedData[periode]) {
        aggregatedData[periode] = {
          periode,
          passages: 0,
          hospitalisations: 0,
          sosMedecins: 0,
          count: 0
        }
      }
      aggregatedData[periode].passages += record.tauxPassages
      aggregatedData[periode].hospitalisations += record.tauxHospitalisations
      aggregatedData[periode].sosMedecins += record.tauxSosMedecins
      aggregatedData[periode].count++
    })
    
    // Calculate averages and sort by date
    const chartData = Object.values(aggregatedData)
      .map(d => ({
        periode: d.periode,
        passages: Math.round(d.passages / d.count),
        hospitalisations: Math.round(d.hospitalisations / d.count),
        sosMedecins: Math.round(d.sosMedecins / d.count),
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.periode.split(" ")
        const [monthB, yearB] = b.periode.split(" ")
        const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"]
        const dateA = new Date(parseInt(yearA), months.indexOf(monthA))
        const dateB = new Date(parseInt(yearB), months.indexOf(monthB))
        return dateA.getTime() - dateB.getTime()
      })
    
    return NextResponse.json({
      data: chartData,
      filters: {
        regions,
        departements,
        classesAge,
        annees,
      },
      totalRecords: records.length,
    })
  } catch (error) {
    console.error("Error reading epidemic data:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
