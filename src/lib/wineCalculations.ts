/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

/**
 * Wine nutritional value calculations per EU Regulation 1169/2011 Annex XIV.
 *
 * Conversion factors (Annex XIV — one authoritative table for both units):
 *   - Alcohol (ethanol):   7 kcal/g  = 29 kJ/g
 *   - Carbohydrates/Sugar: 4 kcal/g  = 17 kJ/g
 *   - Organic acids:       3 kcal/g  = 13 kJ/g
 *   - Polyols (glycerine): 2.4 kcal/g = 10 kJ/g
 *
 * BUG-22: kJ is computed from grams via the Annex XIV kJ/g factors, NOT by
 * multiplying kcal by 4.184 — the two paths round differently and the
 * regulation's kJ table is what regulators check against.
 */

export interface WineNutritionInputs {
  alcoholPercent: number;
  residualSugar: number; // g/L
  totalAcidity: number; // g/L (tartaric acid C4H6O6)
  glycerine: number; // g/L
}

export interface WineNutritionResults {
  glycerine: number; // g/L
  energyKcal: number; // per 100ml
  energyKj: number; // per 100ml
  carbohydrates: number; // g per 100ml
  sugar: number; // g per 100ml
}

export function calculateWineNutrition(inputs: WineNutritionInputs): WineNutritionResults {
  const { alcoholPercent, residualSugar, totalAcidity, glycerine } = inputs;

  // Convert to grams per 100ml
  const alcoholGrams = alcoholPercent * 0.789;
  const sugarGrams = residualSugar / 10;
  const acidityGrams = totalAcidity / 10;
  const glycerineGrams = glycerine / 10;

  const energyKcal = Math.round(
    (alcoholGrams * 7) + (sugarGrams * 4) + (acidityGrams * 3) + (glycerineGrams * 2.4)
  );
  // Annex XIV kJ/g factors, computed independently of kcal.
  const energyKj = Math.round(
    (alcoholGrams * 29) + (sugarGrams * 17) + (acidityGrams * 13) + (glycerineGrams * 10)
  );

  // Carbohydrates include sugar and glycerine (polyol)
  const carbohydrates = Math.round((sugarGrams + glycerineGrams) * 10) / 10;
  const sugar = Math.round(sugarGrams * 10) / 10;

  return {
    glycerine: Math.round(glycerine * 10) / 10,
    energyKcal,
    energyKj,
    carbohydrates,
    sugar,
  };
}
