import { describe, it, expect } from "vitest";
import {
  calculateWineNutrition,
  WineNutritionInputs,
} from "./wineCalculations";

describe("wineCalculations", () => {
  describe("calculateWineNutrition", () => {
    it("calculates realistic wine values correctly", () => {
      // Typical wine: 13% alcohol, 5 g/L sugar, 6 g/L acidity, 10 g/L glycerine
      const inputs: WineNutritionInputs = {
        alcoholPercent: 13,
        residualSugar: 5,
        totalAcidity: 6,
        glycerine: 10,
      };

      const result = calculateWineNutrition(inputs);

      // Alcohol: 13 * 0.789 = 10.257g → 71.8 kcal
      // Sugar: 0.5g → 2 kcal
      // Acidity: 0.6g → 1.8 kcal (3 kcal/g)
      // Glycerine: 1g → 2.4 kcal
      // Total: ~78 kcal
      expect(result.energyKcal).toBeGreaterThan(70);
      expect(result.energyKcal).toBeLessThan(90);
      expect(result.sugar).toBe(0.5);
      expect(result.carbohydrates).toBe(1.5);
    });

    it("handles zero values", () => {
      const inputs: WineNutritionInputs = {
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 0,
        glycerine: 0,
      };

      const result = calculateWineNutrition(inputs);

      expect(result.energyKcal).toBe(0);
      expect(result.energyKj).toBe(0);
      expect(result.carbohydrates).toBe(0);
      expect(result.sugar).toBe(0);
      expect(result.glycerine).toBe(0);
    });
  });

  describe("Annex XIV energy factors (kcal + kJ from grams)", () => {
    it("applies 7 kcal/g and 29 kJ/g for alcohol", () => {
      const result = calculateWineNutrition({
        alcoholPercent: 100,
        residualSugar: 0,
        totalAcidity: 0,
        glycerine: 0,
      });
      // 100 * 0.789 = 78.9g alcohol → 78.9 * 7 = 552.3 kcal, 78.9 * 29 = 2288.1 kJ
      expect(result.energyKcal).toBeCloseTo(552, 0);
      expect(result.energyKj).toBeCloseTo(2288, 0);
    });

    it("applies 4 kcal/g and 17 kJ/g for sugar", () => {
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 1000,
        totalAcidity: 0,
        glycerine: 0,
      });
      // 100g sugar → 400 kcal, 1700 kJ
      expect(result.energyKcal).toBe(400);
      expect(result.energyKj).toBe(1700);
    });

    it("applies 3 kcal/g and 13 kJ/g for organic acid", () => {
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 1000,
        glycerine: 0,
      });
      // 100g acidity → 300 kcal, 1300 kJ
      expect(result.energyKcal).toBe(300);
      expect(result.energyKj).toBe(1300);
    });

    it("applies 2.4 kcal/g and 10 kJ/g for polyol (glycerine)", () => {
      const result = calculateWineNutrition({
        alcoholPercent: 0,
        residualSugar: 0,
        totalAcidity: 0,
        glycerine: 1000,
      });
      // 100g glycerine → 240 kcal, 1000 kJ
      expect(result.energyKcal).toBe(240);
      expect(result.energyKj).toBe(1000);
    });

    it("computes kJ from grams (not from kcal * 4.184)", () => {
      const result = calculateWineNutrition({
        alcoholPercent: 12,
        residualSugar: 3,
        totalAcidity: 5,
        glycerine: 8,
      });
      // alcohol 9.468g, sugar 0.3g, acid 0.5g, glyc 0.8g
      // kJ = 9.468*29 + 0.3*17 + 0.5*13 + 0.8*10 = 274.572 + 5.1 + 6.5 + 8 = 294.172 → 294
      expect(result.energyKj).toBe(294);
    });
  });
});
