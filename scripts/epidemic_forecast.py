#!/usr/bin/env python3
"""
Script de prevision epidemique pour le dashboard hospitalier Pitie-Salpetriere
Utilise les donnees CSV pour generer des previsions sur 12 semaines
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')

# Configuration des chemins
DATA_PATH = "Final_data/pics_activité/"
OUTPUT_PATH = "prediction_data/"

def load_epidemic_data(disease_type):
    """Charge les donnees CSV pour une maladie donnee"""
    file_map = {
        'covid': 'covid-19-passages-aux-urgences-et-actes-sos-medecins-departement.csv',
        'grippe': 'grippe-passages-aux-urgences-et-actes-sos-medecins-departement.csv',
        'bronchiolite': 'bronchiolite-passages-aux-urgences-et-actes-sos-medecins-departement.csv',
        'ira': 'infections-respiratoires-aigues-ira-passages-aux-urgences-et-actes-sos-medecins-departement.csv'
    }
    
    filepath = DATA_PATH + file_map.get(disease_type, file_map['covid'])
    
    try:
        df = pd.read_csv(filepath)
        # Renommer les colonnes pour standardiser
        df.columns = ['date', 'semaine', 'dept_code', 'dept', 'classe_age', 
                     'taux_passages', 'taux_hospit', 'taux_sos', 'region_code', 'region']
        df['date'] = pd.to_datetime(df['date'])
        # S'assurer que les colonnes textuelles sont bien interprétées comme des chaînes
        for text_col in ['dept', 'classe_age', 'region']:
            if text_col in df.columns:
                df[text_col] = df[text_col].astype('string').fillna('')
        return df
    except Exception as e:
        print(f"Erreur chargement {disease_type}: {e}")
        return None

def calculate_seasonality(df, disease_type):
    """Calcule le pattern saisonnier base sur les donnees historiques"""
    # Filtrer pour Ile-de-France (region de Pitie-Salpetriere)
    df_idf = df[df['region'].str.contains('France', case=False, na=False)]
    
    if df_idf.empty:
        df_idf = df
    
    # Agreger par semaine de l'annee
    df_idf['week_of_year'] = df_idf['date'].dt.isocalendar().week
    df_idf['year'] = df_idf['date'].dt.year
    
    # Calculer la moyenne par semaine sur toutes les annees
    seasonal_pattern = df_idf.groupby('week_of_year').agg({
        'taux_passages': 'mean',
        'taux_hospit': 'mean',
        'taux_sos': 'mean'
    }).reset_index()
    
    return seasonal_pattern

def simple_moving_average_forecast(series, window=4, forecast_periods=12):
    """Prevision simple basee sur moyenne mobile"""
    if len(series) < window:
        return [series.mean()] * forecast_periods
    
    last_values = series.tail(window).values
    ma = np.mean(last_values)
    
    # Ajouter une tendance basee sur les derniers changements
    trend = (last_values[-1] - last_values[0]) / window if window > 1 else 0
    
    forecast = []
    for i in range(forecast_periods):
        # Ajouter variabilite saisonniere simulee
        seasonal_factor = 1 + 0.2 * np.sin(2 * np.pi * i / 12)
        predicted = max(0, (ma + trend * i) * seasonal_factor)
        forecast.append(predicted)
    
    return forecast

def generate_forecast(disease_type, region_filter='Île-de-France', weeks_ahead=12):
    """Genere les previsions pour une maladie donnee"""
    df = load_epidemic_data(disease_type)
    
    if df is None:
        return None
    
    # Filtrer par region si specifie
    if region_filter:
        df_filtered = df[df['region'].str.contains(region_filter, case=False, na=False)]
        if df_filtered.empty:
            df_filtered = df
    else:
        df_filtered = df
    
    # Agreger par date
    df_agg = df_filtered.groupby('date').agg({
        'taux_passages': 'mean',
        'taux_hospit': 'mean',
        'taux_sos': 'mean'
    }).reset_index()
    
    df_agg = df_agg.sort_values('date')
    
    # Obtenir la derniere date des donnees
    last_date = df_agg['date'].max()
    
    # Generer les previsions
    forecast_passages = simple_moving_average_forecast(
        df_agg['taux_passages'].fillna(0), 
        window=8, 
        forecast_periods=weeks_ahead
    )
    forecast_hospit = simple_moving_average_forecast(
        df_agg['taux_hospit'].fillna(0), 
        window=8, 
        forecast_periods=weeks_ahead
    )
    
    # Creer le dataframe de prevision
    forecast_dates = [last_date + timedelta(weeks=i+1) for i in range(weeks_ahead)]
    
    forecast_df = pd.DataFrame({
        'date': forecast_dates,
        'semaine': [f"S{d.isocalendar()[1]}" for d in forecast_dates],
        'mois_annee': [d.strftime('%b %Y') for d in forecast_dates],
        'passages_prevu': forecast_passages,
        'hospitalisations_prevu': forecast_hospit,
        'intervalle_bas': [max(0, p * 0.7) for p in forecast_passages],
        'intervalle_haut': [p * 1.3 for p in forecast_passages],
        'niveau_risque': ['Eleve' if p > 1000 else 'Moyen' if p > 500 else 'Faible' for p in forecast_passages],
        'maladie': disease_type
    })
    
    return forecast_df

def calculate_epidemic_periods(df, disease_type):
    """Identifie les periodes epidemiques historiques"""
    if df is None:
        return []
    
    # Definir le seuil epidemique (percentile 75 des taux)
    threshold = df['taux_passages'].quantile(0.75)
    
    df_sorted = df.sort_values('date')
    epidemic_periods = []
    in_epidemic = False
    start_date = None
    
    for _, row in df_sorted.iterrows():
        if row['taux_passages'] > threshold and not in_epidemic:
            in_epidemic = True
            start_date = row['date']
        elif row['taux_passages'] <= threshold and in_epidemic:
            in_epidemic = False
            epidemic_periods.append({
                'debut': start_date.strftime('%Y-%m-%d'),
                'fin': row['date'].strftime('%Y-%m-%d'),
                'duree_semaines': (row['date'] - start_date).days // 7,
                'pic_passages': df_sorted[(df_sorted['date'] >= start_date) & 
                                         (df_sorted['date'] <= row['date'])]['taux_passages'].max()
            })
    
    return epidemic_periods[-5:] if len(epidemic_periods) > 5 else epidemic_periods

def main():
    """Fonction principale pour generer toutes les previsions"""
    diseases = ['covid', 'grippe', 'bronchiolite', 'ira']
    all_forecasts = []
    epidemic_history = {}
    
    print("Generation des previsions epidemiques...")
    
    for disease in diseases:
        print(f"  Traitement: {disease}")
        
        # Generer les previsions
        forecast = generate_forecast(disease, region_filter='Île-de-France', weeks_ahead=12)
        if forecast is not None:
            all_forecasts.append(forecast)
        
        # Calculer les periodes epidemiques historiques
        df = load_epidemic_data(disease)
        if df is not None:
            df_idf = df[df['region'].str.contains('France', case=False, na=False)]
            if not df_idf.empty:
                df_agg = df_idf.groupby('date').agg({'taux_passages': 'mean'}).reset_index()
                epidemic_history[disease] = calculate_epidemic_periods(df_agg, disease)
    
    # Combiner toutes les previsions
    if all_forecasts:
        combined_forecast = pd.concat(all_forecasts, ignore_index=True)
        
        # Sauvegarder en CSV
        combined_forecast.to_csv(OUTPUT_PATH + 'epidemic_forecast_combined.csv', index=False)
        print(f"  Previsions sauvegardees: {OUTPUT_PATH}epidemic_forecast_combined.csv")
        
        # Sauvegarder en JSON pour le frontend
        forecast_json = {
            'generated_at': datetime.now().isoformat(),
            'forecast_weeks': 12,
            'region': 'Île-de-France',
            'forecasts': {}
        }
        
        for disease in diseases:
            disease_forecast = combined_forecast[combined_forecast['maladie'] == disease]
            forecast_json['forecasts'][disease] = disease_forecast.to_dict(orient='records')
        
        forecast_json['epidemic_history'] = epidemic_history
        
        with open(OUTPUT_PATH + 'epidemic_forecast.json', 'w', encoding='utf-8') as f:
            json.dump(forecast_json, f, indent=2, default=str, ensure_ascii=False)
        print(f"  JSON sauvegarde: {OUTPUT_PATH}epidemic_forecast.json")
    
    print("Previsions terminees!")
    return combined_forecast

if __name__ == "__main__":
    main()
