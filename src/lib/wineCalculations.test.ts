import { describe, it, expect } from "vitest";
import {
  calculateWineNutrition,
  calculateDefaultGlycerine,
  WineNutritionInputs,
} from "./wineCalculations";

describe("wineCalculations", () => {
  describe("calculateDefaultGlycerine", () => {
    it("calculates glycerine as ~0.789 g/L per 1% alcohol", () => {
      expect(calculateDefaultGlycerine(13)).toBeCloseTo(10.3, 1);
      expect(calculateDefaultGlycerine(14)).toBeCloseTo(11, 1);
    });

    it("returns 0 for 0% alcohol", () => {
      expect(calculateDefaultGlycerine(0)).toBe(0);
    });
  });

  describe("calculateWineNutrition", () => {
    it("calculates correct values for test case 1: manual glycerine", () => {
      // Inputs: Alcohol=123, Sugar=456, Acidity=789, Glycerine=101112 (manual)
      // Expected: Energy=25375 kcal, kJ=106169, Carbs=10156.8, Sugar=45.6
      const inputs: WineNutritionInputs = {
        alcoholPercent: 123,
        residualSugar: 456,
        totalAcidity: 789,
        glycerine: 101112,
        useManualGlycerine: true,
      };

      const result = calculateWineNutrition(inputs);

      expect(result.energyKcal).toBe(25375);
      expect(result.energyKj).toBe(106169);
      expect(result.carbohydrates).toBe(10156.8);
      expect(result.sugar).toBe(45.6);
      expect(result.glycerine).toBe(101112);
    });

    it("calculates correct values for test case 2: with glycerine input", () => {
      // Inputs: Alcohol=999, Sugar=999, Acidity=999, Glycerine=789 (manual)
      // Glycerine is always manual now
      const inputs: WineNutritionInputs = {
        alcoholPercent: 999,
        residualSugar: 999,
        totalAcidity: 999,
        glycerine: 789,
        useManualGlycerine: true,
      };

      const result = calculateWineNutrition(inputs);

      expect(result.glycerine).toBe(789);
      expect(result.sugar).toBe(99.9);
      // Carbs = (999 + 789) / 10 = 178.8
      expect(result.carbohydrates).toBe(178.8);
      // Energy = 999*0.789*7 + 99.9*4 + 99.9*3.12 + 78.9*2.4 ≈ 6418
      expect(result.energyKcal).toBeCloseTo(6418, -1);
    });

    it("calculates realistic wine values correctly", () => {
      // Typical wine: 13% alcohol, 5 g/L sugar, 6 g/L acidity
      const inputs: WineNutritionInputs = {
        alcoholPercent: 13,
        residualSugar: 5,
        totalAcidity: 6,
        useManualGlycerine: false,
      };

      const result = calculateWineNutrition(inputs);

      // Alcohol: 13 * 0.789 = 10.257g → 71.8 kcal
      // Sugar: 0.5g → 2 kcal
      // Acidity: 0.6g → 1.87 kcal
      // Glycerine: ~1.03g → 2.46 kcal
      // Total: ~78 kcal
      expect(result.energyKcal).toBeGreaterThan(70);
      expect(result.energyKcal).toBeLessThan(90);
      expect(result.sugar).toBe(0.5);
      expect(result.carbohydrates).toBeGreaterThan(1);
    });

    it("handles zero values", () => {
      const inputs: WineNutritionInputs = {
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 0,
        useManualGlycerine: false,
      };

      const result = calculateWineNutrition(inputs);

      expect(result.energyKcal).toBe(0);
      expect(result.energyKj).toBe(0);
      expect(result.carbohydrates).toBe(0);
      expect(result.sugar).toBe(0);
      expect(result.glycerine).toBe(0);
    });

    it("uses manual glycerine when specified", () => {
      const inputs: WineNutritionInputs = {
        alcoholPercent: 13,
        residualSugar: 5,
        totalAcidity: 6,
        glycerine: 15,
        useManualGlycerine: true,
      };

      const result = calculateWineNutrition(inputs);

      expect(result.glycerine).toBe(15);
    });

    it("ignores manual glycerine value when useManualGlycerine is false", () => {
      const inputs: WineNutritionInputs = {
        alcoholPercent: 13,
        residualSugar: 5,
        totalAcidity: 6,
        glycerine: 999, // This should be ignored
        useManualGlycerine: false,
      };

      const result = calculateWineNutrition(inputs);

      // Should use default: 13 * 0.789 ≈ 10.3
      expect(result.glycerine).toBeCloseTo(10.3, 0);
    });
  });

  describe("energy factors compliance", () => {
    it("applies 7 kcal/g for alcohol", () => {
      // 100% alcohol with no other inputs
      const result = calculateWineNutrition({
        alcoholPercent: 100,
        residualSugar: 0,
        totalAcidity: 0,
        glycerine: 0,
        useManualGlycerine: true,
      });

      // 100 * 0.789 = 78.9g alcohol → 78.9 * 7 = 552.3 kcal
      expect(result.energyKcal).toBeCloseTo(552, 0);
    });

    it("applies 4 kcal/g for sugar", () => {
      // 1000 g/L sugar only
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 1000,
        totalAcidity: 0,
        glycerine: 0,
        useManualGlycerine: true,
      });

      // 100g sugar → 100 * 4 = 400 kcal
      expect(result.energyKcal).toBe(400);
    });

    it("applies 3.12 kcal/g for acidity", () => {
      // 1000 g/L acidity only
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 1000,
        glycerine: 0,
        useManualGlycerine: true,
      });

      // 100g acidity → 100 * 3.12 = 312 kcal
      expect(result.energyKcal).toBe(312);
    });

    it("applies 2.4 kcal/g for glycerine", () => {
      // 1000 g/L glycerine only
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 0,
        glycerine: 1000,
        useManualGlycerine: true,
      });

      // 100g glycerine → 100 * 2.4 = 240 kcal
      expect(result.energyKcal).toBe(240);
    });
  });
});
