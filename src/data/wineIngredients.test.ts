import { describe, it, expect } from "vitest";
import {
  wineIngredientCategories,
  getAllIngredients,
  getIngredientById,
  wineProductTypes,
} from "./wineIngredients";

describe("wineIngredients", () => {
  describe("getAllIngredients", () => {
    it("returns all ingredients from all categories", () => {
      const allIngredients = getAllIngredients();
      
      // Count expected ingredients from categories
      const expectedCount = wineIngredientCategories.reduce(
        (sum, cat) => sum + cat.ingredients.length,
        0
      );
      
      expect(allIngredients.length).toBe(expectedCount);
    });

    it("returns ingredients with required properties", () => {
      const allIngredients = getAllIngredients();
      
      allIngredients.forEach((ingredient) => {
        expect(ingredient).toHaveProperty("id");
        expect(ingredient).toHaveProperty("name");
        expect(typeof ingredient.id).toBe("string");
        expect(typeof ingredient.name).toBe("string");
      });
    });
  });

  describe("getIngredientById", () => {
    it("finds an existing ingredient by id", () => {
      const ingredient = getIngredientById("grapes");
      
      expect(ingredient).toBeDefined();
      expect(ingredient?.name).toBe("Grapes");
    });

    it("returns undefined for non-existent id", () => {
      const ingredient = getIngredientById("non_existent_ingredient");
      
      expect(ingredient).toBeUndefined();
    });

    it("finds ingredient with eNumber", () => {
      const ingredient = getIngredientById("argon");
      
      expect(ingredient).toBeDefined();
      expect(ingredient?.eNumber).toBe("E 938");
    });

    it("finds allergen ingredient with correct flag", () => {
      const ingredient = getIngredientById("egg");
      
      expect(ingredient).toBeDefined();
      expect(ingredient?.isAllergen).toBe(true);
    });
  });

  describe("wineIngredientCategories", () => {
    it("has expected category structure", () => {
      expect(wineIngredientCategories.length).toBeGreaterThan(0);
      
      wineIngredientCategories.forEach((category) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("ingredients");
        expect(Array.isArray(category.ingredients)).toBe(true);
      });
    });

    it("contains general category with grapes", () => {
      const generalCategory = wineIngredientCategories.find(
        (cat) => cat.id === "general"
      );
      
      expect(generalCategory).toBeDefined();
      expect(
        generalCategory?.ingredients.some((ing) => ing.id === "grapes")
      ).toBe(true);
    });

    it("contains preservatives category with sulfites", () => {
      const preservativesCategory = wineIngredientCategories.find(
        (cat) => cat.id === "preservatives"
      );
      
      expect(preservativesCategory).toBeDefined();
      expect(
        preservativesCategory?.ingredients.some((ing) => ing.id === "sulfites")
      ).toBe(true);
    });

    it("contains processing aids with allergens", () => {
      const processingAids = wineIngredientCategories.find(
        (cat) => cat.id === "processing_aids"
      );
      
      expect(processingAids).toBeDefined();
      
      const allergens = processingAids?.ingredients.filter(
        (ing) => ing.isAllergen
      );
      expect(allergens?.length).toBeGreaterThan(0);
    });
  });

  describe("wineProductTypes", () => {
    it("has expected product types", () => {
      expect(wineProductTypes.length).toBe(4);
      
      const ids = wineProductTypes.map((pt) => pt.id);
      expect(ids).toContain("wine");
      expect(ids).toContain("aromatized");
      expect(ids).toContain("fortified");
      expect(ids).toContain("spirits");
    });

    it("has label and description for each type", () => {
      wineProductTypes.forEach((productType) => {
        expect(productType).toHaveProperty("id");
        expect(productType).toHaveProperty("label");
        expect(productType).toHaveProperty("description");
        expect(typeof productType.label).toBe("string");
        expect(typeof productType.description).toBe("string");
      });
    });
  });

  describe("eNumber formatting", () => {
    it("eNumbers follow E XXX format", () => {
      const ingredientsWithENumbers = getAllIngredients().filter(
        (ing) => ing.eNumber
      );
      
      expect(ingredientsWithENumbers.length).toBeGreaterThan(0);
      
      ingredientsWithENumbers.forEach((ingredient) => {
        expect(ingredient.eNumber).toMatch(/^E \d+$/);
      });
    });
  });
});
