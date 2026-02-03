export interface BedCapacity {
  service: string
  litsTheoriques: number
  ratioInfirmier: string
  infirmiersRequis: number
  litsExploitables: number
  seuilTension: number
  seuilSaturation: number
  occupationActuelle?: number
}

export interface StaffData {
  categorie: string
  indicateur: string
  valeur: number
  unite: string
}

export interface StockItem {
  categorie: string
  sousType: string
  consoJour: number
  stock30j: number
  stock60j: number
  stock90j: number
  seuilAlerte: string
  seuilCritique: string
  stockActuel?: number
}

export interface GeoData {
  theme: string
  commune: string
  indicateur: string
  annee: string
  valeur: number
  unite: string
}

export interface EpidemicData {
  date: string
  semaine: string
  departement: string
  classeAge: string
  tauxPassagesUrgences: number
  tauxHospitalisations: number
  tauxActesSOS: number
}

export interface PredictionData {
  date: string
  tauxPassagesUrgences: number
  tauxHospitalisations: number
  tauxActesSOS: number
}

export interface Recommendation {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: string
  title: string
  description: string
  action: string
  impact: string
}
