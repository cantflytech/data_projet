// Module de gestion des vacances du personnel
// Correlé avec les periodes epidemiques

export interface VacationPeriod {
  id: string
  employe: string
  service: string
  categorie: 'medecin' | 'infirmier' | 'aide-soignant' | 'administratif' | 'technique'
  dateDebut: string
  dateFin: string
  statut: 'approuve' | 'en_attente' | 'refuse' | 'annule'
  raisonRefus?: string
}

export interface StaffAvailability {
  service: string
  mois: string
  effectifTotal: number
  enConge: number
  disponible: number
  tauxDisponibilite: number
  alerteRisque: boolean
  periodeEpidemique: boolean
}

export interface VacationPolicy {
  periodeBloquee: {
    debut: string
    fin: string
    raison: string
  }[]
  maxCongeSameTime: {
    service: string
    pourcentage: number
  }[]
}

// Politique de conges basee sur les periodes epidemiques
export const vacationPolicy: VacationPolicy = {
  periodeBloquee: [
    { debut: "15 Novembre", fin: "15 Janvier", raison: "Pic bronchiolite et epidemies hivernales" },
    { debut: "1 Janvier", fin: "28 Fevrier", raison: "Pic grippe saisonnier" },
  ],
  maxCongeSameTime: [
    { service: "Urgences / UHCD", pourcentage: 15 },
    { service: "Pediatrie", pourcentage: 15 },
    { service: "Reanimation", pourcentage: 20 },
    { service: "Medecine", pourcentage: 25 },
    { service: "Chirurgie", pourcentage: 25 },
    { service: "Soins intensifs", pourcentage: 20 },
  ]
}

// Demandes de vacances du personnel (exemple)
export const vacationRequests: VacationPeriod[] = [
  { id: "v001", employe: "Dr. Martin", service: "Urgences / UHCD", categorie: "medecin", dateDebut: "2025-12-20", dateFin: "2025-12-31", statut: "refuse", raisonRefus: "Periode epidemique critique" },
  { id: "v002", employe: "Inf. Dubois", service: "Pediatrie", categorie: "infirmier", dateDebut: "2025-11-15", dateFin: "2025-11-25", statut: "refuse", raisonRefus: "Pic bronchiolite prevu" },
  { id: "v003", employe: "Dr. Bernard", service: "Medecine", categorie: "medecin", dateDebut: "2025-09-01", dateFin: "2025-09-15", statut: "approuve" },
  { id: "v004", employe: "Inf. Petit", service: "Reanimation", categorie: "infirmier", dateDebut: "2025-10-01", dateFin: "2025-10-10", statut: "approuve" },
  { id: "v005", employe: "AS. Moreau", service: "Chirurgie", categorie: "aide-soignant", dateDebut: "2025-08-15", dateFin: "2025-08-30", statut: "approuve" },
  { id: "v006", employe: "Dr. Leroy", service: "Pediatrie", categorie: "medecin", dateDebut: "2026-01-05", dateFin: "2026-01-15", statut: "en_attente" },
  { id: "v007", employe: "Inf. Simon", service: "Urgences / UHCD", categorie: "infirmier", dateDebut: "2026-02-10", dateFin: "2026-02-20", statut: "en_attente" },
  { id: "v008", employe: "Dr. Laurent", service: "Soins intensifs", categorie: "medecin", dateDebut: "2025-07-01", dateFin: "2025-07-21", statut: "approuve" },
  { id: "v009", employe: "Inf. Garcia", service: "Medecine", categorie: "infirmier", dateDebut: "2025-12-24", dateFin: "2026-01-02", statut: "refuse", raisonRefus: "Quota service depasse" },
  { id: "v010", employe: "AS. Thomas", service: "Psychiatrie", categorie: "aide-soignant", dateDebut: "2025-11-01", dateFin: "2025-11-08", statut: "approuve" },
]

// Disponibilite du personnel par mois (correlé aux epidemies)
export const staffAvailabilityByMonth: StaffAvailability[] = [
  // Urgences
  { service: "Urgences / UHCD", mois: "Septembre", effectifTotal: 145, enConge: 22, disponible: 123, tauxDisponibilite: 85, alerteRisque: false, periodeEpidemique: false },
  { service: "Urgences / UHCD", mois: "Octobre", effectifTotal: 145, enConge: 15, disponible: 130, tauxDisponibilite: 90, alerteRisque: false, periodeEpidemique: true },
  { service: "Urgences / UHCD", mois: "Novembre", effectifTotal: 145, enConge: 8, disponible: 137, tauxDisponibilite: 94, alerteRisque: false, periodeEpidemique: true },
  { service: "Urgences / UHCD", mois: "Decembre", effectifTotal: 145, enConge: 5, disponible: 140, tauxDisponibilite: 97, alerteRisque: false, periodeEpidemique: true },
  { service: "Urgences / UHCD", mois: "Janvier", effectifTotal: 145, enConge: 7, disponible: 138, tauxDisponibilite: 95, alerteRisque: false, periodeEpidemique: true },
  { service: "Urgences / UHCD", mois: "Fevrier", effectifTotal: 145, enConge: 10, disponible: 135, tauxDisponibilite: 93, alerteRisque: false, periodeEpidemique: true },
  
  // Pediatrie
  { service: "Pediatrie", mois: "Septembre", effectifTotal: 85, enConge: 15, disponible: 70, tauxDisponibilite: 82, alerteRisque: false, periodeEpidemique: false },
  { service: "Pediatrie", mois: "Octobre", effectifTotal: 85, enConge: 8, disponible: 77, tauxDisponibilite: 91, alerteRisque: false, periodeEpidemique: true },
  { service: "Pediatrie", mois: "Novembre", effectifTotal: 85, enConge: 4, disponible: 81, tauxDisponibilite: 95, alerteRisque: false, periodeEpidemique: true },
  { service: "Pediatrie", mois: "Decembre", effectifTotal: 85, enConge: 3, disponible: 82, tauxDisponibilite: 96, alerteRisque: false, periodeEpidemique: true },
  { service: "Pediatrie", mois: "Janvier", effectifTotal: 85, enConge: 5, disponible: 80, tauxDisponibilite: 94, alerteRisque: false, periodeEpidemique: true },
  { service: "Pediatrie", mois: "Fevrier", effectifTotal: 85, enConge: 10, disponible: 75, tauxDisponibilite: 88, alerteRisque: false, periodeEpidemique: true },
  
  // Reanimation
  { service: "Reanimation", mois: "Septembre", effectifTotal: 120, enConge: 20, disponible: 100, tauxDisponibilite: 83, alerteRisque: false, periodeEpidemique: false },
  { service: "Reanimation", mois: "Octobre", effectifTotal: 120, enConge: 12, disponible: 108, tauxDisponibilite: 90, alerteRisque: false, periodeEpidemique: true },
  { service: "Reanimation", mois: "Novembre", effectifTotal: 120, enConge: 8, disponible: 112, tauxDisponibilite: 93, alerteRisque: false, periodeEpidemique: true },
  { service: "Reanimation", mois: "Decembre", effectifTotal: 120, enConge: 5, disponible: 115, tauxDisponibilite: 96, alerteRisque: false, periodeEpidemique: true },
  { service: "Reanimation", mois: "Janvier", effectifTotal: 120, enConge: 6, disponible: 114, tauxDisponibilite: 95, alerteRisque: false, periodeEpidemique: true },
  { service: "Reanimation", mois: "Fevrier", effectifTotal: 120, enConge: 10, disponible: 110, tauxDisponibilite: 92, alerteRisque: false, periodeEpidemique: true },
]

// Fonction pour verifier si une demande de conge est autorisee
export function checkVacationRequest(
  request: Omit<VacationPeriod, 'id' | 'statut' | 'raisonRefus'>,
  currentStaffOnLeave: number,
  totalStaff: number
): { approved: boolean; reason?: string } {
  const requestDate = new Date(request.dateDebut)
  const requestMonth = requestDate.toLocaleString('fr-FR', { month: 'long' })
  
  // Verifier les periodes bloquees
  for (const blocked of vacationPolicy.periodeBloquee) {
    // Logique simplifiee pour demo
    if (requestMonth === 'novembre' || requestMonth === 'decembre' || requestMonth === 'janvier') {
      if (request.service === 'Pediatrie' || request.service === 'Urgences / UHCD') {
        return {
          approved: false,
          reason: `Periode bloquee: ${blocked.raison}`
        }
      }
    }
  }
  
  // Verifier le quota par service
  const servicePolicy = vacationPolicy.maxCongeSameTime.find(p => p.service === request.service)
  if (servicePolicy) {
    const currentPercentage = (currentStaffOnLeave / totalStaff) * 100
    if (currentPercentage + (1 / totalStaff * 100) > servicePolicy.pourcentage) {
      return {
        approved: false,
        reason: `Quota de ${servicePolicy.pourcentage}% depasse pour le service ${request.service}`
      }
    }
  }
  
  return { approved: true }
}

// Recommendations de gestion du personnel pendant les epidemies
export const staffRecommendations = [
  {
    periode: "Octobre - Debut epidemie",
    actions: [
      "Finaliser tous les conges reportes avant le 15 octobre",
      "Recruter le personnel saisonnier (CDD)",
      "Former le personnel aux protocoles epidemiques"
    ]
  },
  {
    periode: "Novembre-Decembre - Pic epidemique",
    actions: [
      "Bloquer les nouveaux conges sauf urgence",
      "Activer les heures supplementaires",
      "Rappeler le personnel en reserve",
      "Ouvrir les postes de renfort"
    ]
  },
  {
    periode: "Janvier-Fevrier - Maintien tension",
    actions: [
      "Maintenir les restrictions de conges",
      "Evaluer la fatigue du personnel",
      "Planifier les recuperations post-crise"
    ]
  },
  {
    periode: "Mars-Avril - Sortie de crise",
    actions: [
      "Assouplir les restrictions de conges",
      "Permettre la recuperation des heures",
      "Planifier les formations"
    ]
  }
]
