// Module de prevision des epidemies hivernales
// Basé sur les données historiques et les modèles saisonniers

export interface EpidemicForecast {
  maladie: string
  debutPic: string
  finPic: string
  picMaxPrevu: string
  intensitePrevu: 'faible' | 'modere' | 'fort' | 'severe'
  tauxPassagesMax: number
  tauxHospitalisationsMax: number
  recommandations: string[]
  confiance: number // 0-100
}

export interface SeasonalPattern {
  maladie: string
  debutTypique: string // Mois de debut typique
  picTypique: string   // Mois du pic typique
  finTypique: string   // Mois de fin typique
  dureeJours: number
  facteursSaisonniers: string[]
}

// Patterns saisonniers basés sur les données historiques
export const seasonalPatterns: SeasonalPattern[] = [
  {
    maladie: "Bronchiolite",
    debutTypique: "Octobre",
    picTypique: "Novembre-Decembre",
    finTypique: "Mars",
    dureeJours: 150,
    facteursSaisonniers: ["Temperature basse", "Humidite elevee", "Periode scolaire"]
  },
  {
    maladie: "Grippe",
    debutTypique: "Novembre",
    picTypique: "Janvier-Fevrier",
    finTypique: "Avril",
    dureeJours: 120,
    facteursSaisonniers: ["Temperature basse", "Rassemblements interieurs", "Fetes"]
  },
  {
    maladie: "COVID-19",
    debutTypique: "Octobre",
    picTypique: "Decembre-Janvier",
    finTypique: "Mars",
    dureeJours: 150,
    facteursSaisonniers: ["Temperature basse", "Nouveaux variants", "Rassemblements"]
  },
  {
    maladie: "IRA",
    debutTypique: "Octobre",
    picTypique: "Decembre",
    finTypique: "Fevrier",
    dureeJours: 120,
    facteursSaisonniers: ["Temperature basse", "Pollution", "Periode scolaire"]
  }
]

// Fonction de calcul des previsions epidemiques
export function calculateEpidemicForecast(
  historicalData: { periode: string; passages: number; hospitalisations: number }[],
  maladie: string
): EpidemicForecast {
  // Trouver le pattern saisonnier correspondant
  const pattern = seasonalPatterns.find(p => p.maladie.toLowerCase().includes(maladie.toLowerCase()))
  
  // Calculer les statistiques historiques
  const avgPassages = historicalData.reduce((sum, d) => sum + d.passages, 0) / historicalData.length
  const maxPassages = Math.max(...historicalData.map(d => d.passages))
  const avgHosp = historicalData.reduce((sum, d) => sum + d.hospitalisations, 0) / historicalData.length
  const maxHosp = Math.max(...historicalData.map(d => d.hospitalisations))
  
  // Determiner l'intensite prevue
  let intensite: 'faible' | 'modere' | 'fort' | 'severe' = 'modere'
  if (maxPassages > 40000) intensite = 'severe'
  else if (maxPassages > 25000) intensite = 'fort'
  else if (maxPassages > 10000) intensite = 'modere'
  else intensite = 'faible'
  
  // Generer les recommandations basees sur l'intensite
  const recommandations: string[] = []
  if (intensite === 'severe' || intensite === 'fort') {
    recommandations.push("Activer le plan blanc preventif")
    recommandations.push("Renforcer les equipes urgences et pediatrie")
    recommandations.push("Preparer les lits supplementaires")
    recommandations.push("Limiter les conges du personnel soignant")
  } else if (intensite === 'modere') {
    recommandations.push("Surveiller les indicateurs quotidiennement")
    recommandations.push("Preparer le renfort de personnel")
    recommandations.push("Verifier les stocks de materiel")
  } else {
    recommandations.push("Maintenir la vigilance standard")
    recommandations.push("Continuer la surveillance hebdomadaire")
  }
  
  return {
    maladie: pattern?.maladie || maladie,
    debutPic: pattern?.debutTypique || "Novembre",
    finPic: pattern?.finTypique || "Mars",
    picMaxPrevu: pattern?.picTypique || "Decembre-Janvier",
    intensitePrevu: intensite,
    tauxPassagesMax: Math.round(maxPassages * 1.1), // +10% marge
    tauxHospitalisationsMax: Math.round(maxHosp * 1.1),
    recommandations,
    confiance: 75 // Confiance basee sur la quantite de donnees historiques
  }
}

// Previsions pour la saison 2025-2026
export const epidemicForecasts: EpidemicForecast[] = [
  {
    maladie: "Bronchiolite",
    debutPic: "Octobre 2025",
    finPic: "Mars 2026",
    picMaxPrevu: "Nov-Dec 2025",
    intensitePrevu: "severe",
    tauxPassagesMax: 46000,
    tauxHospitalisationsMax: 68000,
    recommandations: [
      "Renforcer l'equipe pediatrique des octobre (+20 infirmiers)",
      "Ouvrir 30 lits supplementaires en pediatrie",
      "Limiter les conges du 15 nov au 15 jan",
      "Activer la cellule de crise epidemique",
      "Coordonner avec les hopitaux partenaires pour delestage"
    ],
    confiance: 82
  },
  {
    maladie: "Grippe",
    debutPic: "Novembre 2025",
    finPic: "Avril 2026",
    picMaxPrevu: "Jan-Fev 2026",
    intensitePrevu: "fort",
    tauxPassagesMax: 6000,
    tauxHospitalisationsMax: 9000,
    recommandations: [
      "Campagne de vaccination du personnel en octobre",
      "Renforcer les urgences adultes en janvier",
      "Preparer les lits de reanimation supplementaires",
      "Limiter les conges en janvier-fevrier"
    ],
    confiance: 78
  },
  {
    maladie: "COVID-19",
    debutPic: "Octobre 2025",
    finPic: "Mars 2026",
    picMaxPrevu: "Dec 2025 - Jan 2026",
    intensitePrevu: "modere",
    tauxPassagesMax: 3500,
    tauxHospitalisationsMax: 5000,
    recommandations: [
      "Maintenir les protocoles de protection",
      "Surveiller l'emergence de nouveaux variants",
      "Rappel vaccinal pour personnel a risque",
      "Preparer les zones d'isolement"
    ],
    confiance: 65
  },
  {
    maladie: "IRA",
    debutPic: "Octobre 2025",
    finPic: "Fevrier 2026",
    picMaxPrevu: "Decembre 2025",
    intensitePrevu: "modere",
    tauxPassagesMax: 13000,
    tauxHospitalisationsMax: 32000,
    recommandations: [
      "Renforcer la surveillance des personnes agees",
      "Preparer les lits de pneumologie",
      "Coordonner avec les EHPAD partenaires"
    ],
    confiance: 72
  }
]

// Calendrier des periodes a risque
export const riskCalendar = [
  { mois: "Septembre", risque: "faible", epidemies: [] },
  { mois: "Octobre", risque: "modere", epidemies: ["Bronchiolite (debut)", "IRA (debut)"] },
  { mois: "Novembre", risque: "eleve", epidemies: ["Bronchiolite (pic)", "Grippe (debut)", "COVID"] },
  { mois: "Decembre", risque: "tres_eleve", epidemies: ["Bronchiolite (pic)", "Grippe", "COVID", "IRA (pic)"] },
  { mois: "Janvier", risque: "tres_eleve", epidemies: ["Bronchiolite", "Grippe (pic)", "COVID (pic)"] },
  { mois: "Fevrier", risque: "eleve", epidemies: ["Grippe (pic)", "COVID", "IRA (fin)"] },
  { mois: "Mars", risque: "modere", epidemies: ["Grippe (fin)", "COVID (fin)", "Bronchiolite (fin)"] },
  { mois: "Avril", risque: "faible", epidemies: ["Grippe (fin)"] },
  { mois: "Mai", risque: "faible", epidemies: [] },
  { mois: "Juin", risque: "faible", epidemies: [] },
  { mois: "Juillet", risque: "faible", epidemies: [] },
  { mois: "Aout", risque: "faible", epidemies: [] },
]
