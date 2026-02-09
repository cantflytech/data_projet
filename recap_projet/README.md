# Récapitulatif du projet

## 1. Vision générale
- Projet : tableau de bord hospitalier pour l’hôpital Pitié-Salpêtrière.
- Objectif : offrir une vue consolidée des capacités (lits, stocks, personnel) et des dynamiques épidémiques.
- Fonctions clés : KPIs temps réel, visualisation d’historiques, prévisions 12 semaines, recommandations opératoires, simulations.
- Public cible : direction hospitalière, cellule de crise, responsables de pôles.
- Valeur : anticipation des pics d’activité, pilotage des ressources, soutien décisionnel.

## 2. Données et traitements
- **Sources** :
  - CSV Santé Publique France (`Final_data/pics_activité/`) pour COVID, grippe, bronchiolite, IRA.
  - Jeux internes (`Final_data/interne/`) pour lits, effectifs, stocks.
  - Données géographiques (`Final_data/geographique/`).
- **Nettoyage** : scripts Python (pandas) unifiant schémas, conversion dates, création saison/semaine ISO.
- **Agrégations** : moyennes hebdomadaires par région (focus Île-de-France), calculs ATC pour la pharmacie.
- **Sorties** :
  - `data/processed/medications_by_atc*.csv`.
  - `prediction_data/epidemic_forecast_{combined,json}`.
- **Limites** : ingestion CSV manuelle, granularité partielle sur les classes d’âge/départements, pas de pipeline automatisé.

## 3. Vision produit
- Dashboard mono-page responsive, navigation par onglets (activité, capacités, recommandations, simulation, géographie).
- UI shadcn : cards, dropdowns, sliders, tabs cohérents.
- Graphiques Recharts : tendances épidémiques, charge lits, répartition personnel, stocks critiques.
- Module simulation : sliders pour scénarios d’afflux patients et impacts.
- Recommandations dynamiques selon niveaux de risque.
- UX : thème sombre modern, interactions rapides, app francisée.

## 4. Stack technique
- **Frontend** : Next.js 16 (App Router) / React 19, Tailwind CSS 3.4 + tailwind-merge, shadcn/ui, Recharts, lucide-react.
- **Backend léger** : routes API Next (`app/api/*`) exposant les datasets.
- **Data** : Python 3.12 (venv), pandas/numpy (`analyse/clean_open_phmev.py`, `scripts/epidemic_forecast.py`).
- **Build & outils** : pnpm, TypeScript strict, ESLint (à finaliser), tests à compléter.
- **Déploiement envisagé** : Vercel/Azure, pipeline de refresh data (GitHub Actions + cron) à construire.

## 5. Prévisions
- Script `scripts/epidemic_forecast.py` : moyenne mobile (fenêtre 8), tendance, facteur saisonnier sinusoidal.
- Prévisions 12 semaines pour COVID/grippe/bronchiolite/IRA (passages urgences, hospitalisations, intervalles 70-130 %, niveau de risque).
- Limites : modèle simple, pas de features exogènes, pas de backtesting ni métriques d’erreur historisées.
- Pistes : Prophet/ARIMA/LSTM, features météo/vacances, suivi MAE/RMSE et alertes de dérive.

## 6. Roadmap
1. Modèles prédictifs avancés + instrumentation des performances.
2. ETL automatisé et CI pour les données.
3. Filtres dynamiques, export PDF/CSV, alerting mail.
4. Résolution warnings build, linting/Testing (Playwright, Jest).
5. Authentification, gestion des rôles, monitoring des scripts Python.
