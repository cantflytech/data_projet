# Récapitulatif du projet

## Résumé
Tableau de bord hospitalier pour l'hôpital Pitié-Salpêtrière, combinant données historiques et prévisions épidémiques sur 12 semaines. Frontend Next.js 16 (React 19) avec composants shadcn/Tailwind, alimenté par des scripts Python traitant les CSV hospitaliers.

## Architecture
- **Frontend** : Next.js App Router, composants client Recharts, Tailwind CSS 3.4 + tailwind-merge.
- **UI kit** : Base shadcn (button, card, dropdown, etc.) + thèmes Tailwind.
- **Backend léger** : Routes API Next (`app/api/*`) expose données agrégées/forecasts.
- **Pipeline data** :
  - Données brutes dans `Final_data/`
  - Scripts Python (`analyse/`, `scripts/`) nettoient et agrègent
  - Sorties dans `data/processed/` et `prediction_data/`
- **Outillage** : pnpm pour le frontend, venv Python 3.12 pour les scripts.

## Features clés
- Cartes KPI (lits, stocks, personnel) et graphiques Recharts.
- Prévisions 12 semaines (passages urgences, hospitalisations, SOS Médecins) avec niveaux de risque.
- Panneaux recommandations/simulations, insights géographiques, onglets thématiques.
- API interne pour data temps réel côté frontend.

## Valeur métier
- Vision consolidée des capacités hospitalières.
- Anticipation des pics d’activité pour ajuster lits/personnel/stocks.
- Support décisionnel pour la direction médicale sur les scénarios épidémiques majeurs.

## Limites actuelles
- Modèles de prévision basés sur moyenne mobile simple.
- Ingestion CSV manuelle (pas de pipeline automatisé ni monitoring).
- Pas d’authentification ni gestion des rôles utilisateurs.
- Quelques warnings build (baseline-browser-mapping) et typings Recharts à corriger.
- Documentation produit peu développée.

## Roadmap
1. Intégrer Prophet/ARIMA ou modèles sériels avancés + métrologie d’erreur.
2. Mettre en place un ETL automatisé et CI pour rafraîchir données agrégées.
3. Ajouter filtres dynamiques, export (PDF/CSV), alertes email.
4. Résoudre warnings build, activer lint/tests E2E (Playwright).
5. Sécuriser (auth SSO, gestion environnements, monitoring scripts).
