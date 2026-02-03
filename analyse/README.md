# Analyses

## Nettoyage et synthèse des médicaments (OPEN_PHMEV)

Le script `clean_open_phmev.py` agrège le fichier volumineux `data/OPEN_PHMEV_2024.CSV` par catégorie thérapeutique (classification ATC).

### Pré-requis

```powershell
pip install -r requirements.txt
```

### Utilisation

```powershell
python analyse/clean_open_phmev.py
```

Deux fichiers seront générés dans `data/processed/` :

- `medications_by_atc5.csv` : vue détaillée à la granularité ATC5 (code médicament).
- `medications_by_atc1.csv` : vue synthétique par système thérapeutique.

Chaque fichier contient les colonnes :

- `boites` : nombre total de boîtes distribuées.
- `rem` : montant remboursé.
- `bse` : base de sécurité sociale associée.
