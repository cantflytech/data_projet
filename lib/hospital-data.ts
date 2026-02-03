import type { BedCapacity, StaffData, StockItem, GeoData, PredictionData, Recommendation } from './data-types'

export const bedCapacityData: BedCapacity[] = [
  { service: "Medecine", litsTheoriques: 847, ratioInfirmier: "1/8", infirmiersRequis: 106, litsExploitables: 820, seuilTension: 80, seuilSaturation: 90, occupationActuelle: 78 },
  { service: "Chirurgie", litsTheoriques: 490, ratioInfirmier: "1/7", infirmiersRequis: 70, litsExploitables: 470, seuilTension: 80, seuilSaturation: 90, occupationActuelle: 85 },
  { service: "Urgences / UHCD", litsTheoriques: 134, ratioInfirmier: "1/4", infirmiersRequis: 34, litsExploitables: 120, seuilTension: 75, seuilSaturation: 85, occupationActuelle: 92 },
  { service: "Reanimation", litsTheoriques: 134, ratioInfirmier: "1/2", infirmiersRequis: 67, litsExploitables: 115, seuilTension: 70, seuilSaturation: 85, occupationActuelle: 72 },
  { service: "Soins intensifs", litsTheoriques: 111, ratioInfirmier: "1/3", infirmiersRequis: 37, litsExploitables: 100, seuilTension: 75, seuilSaturation: 90, occupationActuelle: 81 },
  { service: "Pediatrie", litsTheoriques: 156, ratioInfirmier: "1/6", infirmiersRequis: 26, litsExploitables: 145, seuilTension: 80, seuilSaturation: 90, occupationActuelle: 65 },
  { service: "Psychiatrie", litsTheoriques: 134, ratioInfirmier: "1/10", infirmiersRequis: 14, litsExploitables: 130, seuilTension: 85, seuilSaturation: 95, occupationActuelle: 88 },
  { service: "SSR / SLD", litsTheoriques: 178, ratioInfirmier: "1/10", infirmiersRequis: 18, litsExploitables: 170, seuilTension: 85, seuilSaturation: 95, occupationActuelle: 91 },
]

export const staffData: StaffData[] = [
  { categorie: "Ressources humaines", indicateur: "Professionnels", valeur: 11000, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Medecins seniors", valeur: 1626, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Seniors hospitaliers", valeur: 5091, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Medico-techniques", valeur: 3026, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Infirmiers", valeur: 2455, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Administratifs", valeur: 1294, unite: "personnes" },
  { categorie: "Ressources humaines", indicateur: "Etudiants hospitaliers", valeur: 687, unite: "personnes" },
]

export const stockData: StockItem[] = [
  { categorie: "Medicaments", sousType: "Antibiotiques / antiviraux", consoJour: 589, stock30j: 17670, stock60j: 35340, stock90j: 53010, seuilAlerte: "< 20 j", seuilCritique: "< 10 j", stockActuel: 42000 },
  { categorie: "Medicaments", sousType: "Antidotes / produits NRBC", consoJour: 44, stock30j: 1320, stock60j: 2640, stock90j: 3960, seuilAlerte: "< 25 j", seuilCritique: "< 15 j", stockActuel: 3200 },
  { categorie: "Pipettes", sousType: "Pipettes", consoJour: 8000, stock30j: 240000, stock60j: 480000, stock90j: 720000, seuilAlerte: "< 20 j", seuilCritique: "< 10 j", stockActuel: 520000 },
  { categorie: "Portoirs", sousType: "Portoirs", consoJour: 400, stock30j: 12000, stock60j: 24000, stock90j: 36000, seuilAlerte: "< 30 j", seuilCritique: "< 15 j", stockActuel: 28000 },
  { categorie: "Limes / petits instruments", sousType: "Limes / petits instruments", consoJour: 600, stock30j: 18000, stock60j: 36000, stock90j: 54000, seuilAlerte: "< 30 j", seuilCritique: "< 15 j", stockActuel: 45000 },
  { categorie: "Compresses", sousType: "Compresses", consoJour: 200000, stock30j: 6000000, stock60j: 12000000, stock90j: 18000000, seuilAlerte: "< 15 j", seuilCritique: "< 7 j", stockActuel: 9500000 },
  { categorie: "Sets de soins", sousType: "Sets de soins", consoJour: 6000, stock30j: 180000, stock60j: 360000, stock90j: 540000, seuilAlerte: "< 20 j", seuilCritique: "< 10 j", stockActuel: 280000 },
  { categorie: "Seringues", sousType: "Seringues", consoJour: 15000, stock30j: 450000, stock60j: 900000, stock90j: 1350000, seuilAlerte: "< 20 j", seuilCritique: "< 10 j", stockActuel: 750000 },
]

export const geoData: GeoData[] = [
  { theme: "Population", commune: "Paris 13e", indicateur: "Population totale", annee: "2022", valeur: 177735, unite: "habitants" },
  { theme: "Population", commune: "Paris 13e", indicateur: "Densite de population", annee: "2022", valeur: 24858, unite: "hab/km2" },
  { theme: "Population", commune: "Paris 13e", indicateur: "Naissances domiciliees", annee: "2024", valeur: 1532, unite: "naissances" },
  { theme: "Population", commune: "Paris 13e", indicateur: "Deces domicilies", annee: "2024", valeur: 1360, unite: "deces" },
  { theme: "Revenus", commune: "Paris 13e", indicateur: "Taux de pauvrete", annee: "2021", valeur: 18, unite: "%" },
  { theme: "Emploi", commune: "Paris 13e", indicateur: "Taux de chomage 15-64 ans", annee: "2022", valeur: 12, unite: "%" },
]

export const epidemicTrends = {
  covid: [
    { periode: "Oct 2024", passages: 842, hospitalisations: 207, sosMedecins: 709 },
    { periode: "Oct 2024", passages: 1617, hospitalisations: 376, sosMedecins: 2599 },
    { periode: "Nov 2024", passages: 1538, hospitalisations: 436, sosMedecins: 2116 },
    { periode: "Nov 2024", passages: 932, hospitalisations: 610, sosMedecins: 1370 },
    { periode: "Nov 2024", passages: 227, hospitalisations: 0, sosMedecins: 459 },
    { periode: "Nov 2024", passages: 595, hospitalisations: 1205, sosMedecins: 421 },
    { periode: "Dec 2024", passages: 827, hospitalisations: 2786, sosMedecins: 2050 },
    { periode: "Dec 2024", passages: 211, hospitalisations: 326, sosMedecins: 427 },
    { periode: "Dec 2024", passages: 684, hospitalisations: 0, sosMedecins: 5769 },
    { periode: "Dec 2024", passages: 2913, hospitalisations: 4545, sosMedecins: 2041 },
    { periode: "Jan 2025", passages: 1538, hospitalisations: 4360, sosMedecins: 2116 },
    { periode: "Jan 2025", passages: 637, hospitalisations: 1989, sosMedecins: 114 },
  ],
  grippe: [
    { periode: "Oct 2024", passages: 0, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Oct 2024", passages: 106, hospitalisations: 211, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 0, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 0, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 320, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 237, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 300, hospitalisations: 645, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 0, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 1299, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 2700, hospitalisations: 1563, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 3687, hospitalisations: 8000, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 5484, hospitalisations: 2632, sosMedecins: 0 },
  ],
  bronchiolite: [
    { periode: "Oct 2024", passages: 5281, hospitalisations: 9091, sosMedecins: 0 },
    { periode: "Oct 2024", passages: 17798, hospitalisations: 31250, sosMedecins: 9040 },
    { periode: "Nov 2024", passages: 18070, hospitalisations: 35938, sosMedecins: 7921 },
    { periode: "Nov 2024", passages: 37569, hospitalisations: 53488, sosMedecins: 14325 },
    { periode: "Nov 2024", passages: 41808, hospitalisations: 61842, sosMedecins: 19137 },
    { periode: "Nov 2024", passages: 41808, hospitalisations: 61842, sosMedecins: 19137 },
    { periode: "Dec 2024", passages: 33000, hospitalisations: 50000, sosMedecins: 16535 },
    { periode: "Dec 2024", passages: 36537, hospitalisations: 54545, sosMedecins: 15646 },
    { periode: "Dec 2024", passages: 36440, hospitalisations: 52133, sosMedecins: 11659 },
    { periode: "Dec 2024", passages: 28571, hospitalisations: 41818, sosMedecins: 15476 },
    { periode: "Jan 2025", passages: 23237, hospitalisations: 37589, sosMedecins: 12632 },
    { periode: "Jan 2025", passages: 18808, hospitalisations: 29032, sosMedecins: 6280 },
  ],
  ira: [
    { periode: "Oct 2024", passages: 4339, hospitalisations: 9298, sosMedecins: 0 },
    { periode: "Oct 2024", passages: 2682, hospitalisations: 7407, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 2178, hospitalisations: 3947, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 4149, hospitalisations: 17857, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 2471, hospitalisations: 6494, sosMedecins: 0 },
    { periode: "Nov 2024", passages: 1224, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 3038, hospitalisations: 5591, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 11513, hospitalisations: 29167, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 1320, hospitalisations: 0, sosMedecins: 0 },
    { periode: "Dec 2024", passages: 4022, hospitalisations: 9137, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 6889, hospitalisations: 12633, sosMedecins: 0 },
    { periode: "Jan 2025", passages: 5091, hospitalisations: 5882, sosMedecins: 0 },
  ],
}

export const predictionData: PredictionData[] = [
  { date: "2026-01-26", tauxPassagesUrgences: 145.6, tauxHospitalisations: 191.0, tauxActesSOS: 270.3 },
  { date: "2026-02-02", tauxPassagesUrgences: 146.5, tauxHospitalisations: 183.2, tauxActesSOS: 412.3 },
  { date: "2026-02-09", tauxPassagesUrgences: 187.2, tauxHospitalisations: 223.3, tauxActesSOS: 630.9 },
  { date: "2026-02-16", tauxPassagesUrgences: 236.8, tauxHospitalisations: 321.1, tauxActesSOS: 830.2 },
  { date: "2026-02-23", tauxPassagesUrgences: 288.9, tauxHospitalisations: 388.2, tauxActesSOS: 1037.9 },
  { date: "2026-03-02", tauxPassagesUrgences: 320.5, tauxHospitalisations: 439.1, tauxActesSOS: 1125.4 },
  { date: "2026-03-09", tauxPassagesUrgences: 346.9, tauxHospitalisations: 522.7, tauxActesSOS: 1146.8 },
  { date: "2026-03-16", tauxPassagesUrgences: 348.9, tauxHospitalisations: 506.9, tauxActesSOS: 1181.7 },
  { date: "2026-03-23", tauxPassagesUrgences: 378.1, tauxHospitalisations: 552.2, tauxActesSOS: 1208.7 },
  { date: "2026-03-30", tauxPassagesUrgences: 391.1, tauxHospitalisations: 562.5, tauxActesSOS: 1179.6 },
  { date: "2026-04-06", tauxPassagesUrgences: 377.7, tauxHospitalisations: 557.7, tauxActesSOS: 1224.7 },
  { date: "2026-04-13", tauxPassagesUrgences: 387.5, tauxHospitalisations: 569.0, tauxActesSOS: 1255.0 },
]

export function generateRecommendations(): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Check bed capacity
  bedCapacityData.forEach(service => {
    if (service.occupationActuelle && service.occupationActuelle >= service.seuilSaturation) {
      recommendations.push({
        id: `bed-critical-${service.service}`,
        type: 'critical',
        category: 'Capacite',
        title: `Saturation ${service.service}`,
        description: `Le service ${service.service} est en saturation avec ${service.occupationActuelle}% d'occupation.`,
        action: `Activer le plan de delestage et rediriger les admissions vers les services partenaires.`,
        impact: `${Math.round(service.litsExploitables * (service.occupationActuelle - service.seuilTension) / 100)} lits a liberer`,
      })
    } else if (service.occupationActuelle && service.occupationActuelle >= service.seuilTension) {
      recommendations.push({
        id: `bed-warning-${service.service}`,
        type: 'warning',
        category: 'Capacite',
        title: `Tension ${service.service}`,
        description: `Le service ${service.service} approche la saturation avec ${service.occupationActuelle}% d'occupation.`,
        action: `Preparer le personnel supplementaire et anticiper les sorties.`,
        impact: `Seuil de saturation dans ${Math.round((service.seuilSaturation - service.occupationActuelle) / 2)} heures`,
      })
    }
  })

  // Check stock levels
  stockData.forEach(stock => {
    if (stock.stockActuel) {
      const joursRestants = Math.round(stock.stockActuel / stock.consoJour)
      if (joursRestants < 10) {
        recommendations.push({
          id: `stock-critical-${stock.categorie}`,
          type: 'critical',
          category: 'Stock',
          title: `Stock critique: ${stock.sousType}`,
          description: `Il reste seulement ${joursRestants} jours de stock pour ${stock.sousType}.`,
          action: `Commander en urgence aupres du fournisseur principal.`,
          impact: `Rupture estimee dans ${joursRestants} jours`,
        })
      } else if (joursRestants < 20) {
        recommendations.push({
          id: `stock-warning-${stock.categorie}`,
          type: 'warning',
          category: 'Stock',
          title: `Stock faible: ${stock.sousType}`,
          description: `${joursRestants} jours de stock restant pour ${stock.sousType}.`,
          action: `Planifier une commande de reapprovisionnement.`,
          impact: `Seuil d'alerte atteint`,
        })
      }
    }
  })

  // Epidemic-based recommendations
  const lastBronchiolite = epidemicTrends.bronchiolite[epidemicTrends.bronchiolite.length - 1]
  if (lastBronchiolite.passages > 20000) {
    recommendations.push({
      id: 'epidemic-bronchiolite',
      type: 'warning',
      category: 'Epidemie',
      title: 'Pic de bronchiolite detecte',
      description: `Taux de passages urgences: ${lastBronchiolite.passages.toLocaleString()} pour 100k habitants.`,
      action: `Renforcer l'equipe pediatrique et preparer les lits supplementaires.`,
      impact: `+15 infirmiers recommandes en pediatrie`,
    })
  }

  // Prediction-based recommendations
  const futurePrediction = predictionData[predictionData.length - 1]
  if (futurePrediction.tauxHospitalisations > 500) {
    recommendations.push({
      id: 'prediction-covid',
      type: 'info',
      category: 'Prevision',
      title: 'Hausse prevue des hospitalisations COVID',
      description: `Les modeles predictifs indiquent une hausse des hospitalisations COVID dans les prochaines semaines.`,
      action: `Anticiper les ressources et preparer le protocole COVID.`,
      impact: `Taux prevu: ${futurePrediction.tauxHospitalisations.toFixed(0)}/100k`,
    })
  }

  return recommendations
}
