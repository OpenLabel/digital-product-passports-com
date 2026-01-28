import { describe, it, expect } from "vitest";
import {
  packagingMaterialTypes,
  materialCompositions,
  materialCategories,
  disposalMethods,
  getCompositionsByCategory,
} from "./wineRecycling";

describe("wineRecycling", () => {
  describe("packagingMaterialTypes", () => {
    it("has expected packaging types", () => {
      expect(packagingMaterialTypes.length).toBeGreaterThan(0);
      
      const ids = packagingMaterialTypes.map((t) => t.id);
      expect(ids).toContain("bottle");
      expect(ids).toContain("cork");
      expect(ids).toContain("capsule");
    });

    it("has required properties for each type", () => {
      packagingMaterialTypes.forEach((type) => {
        expect(type).toHaveProperty("id");
        expect(type).toHaveProperty("name");
        expect(type).toHaveProperty("icon");
        expect(typeof type.id).toBe("string");
        expect(typeof type.name).toBe("string");
        expect(typeof type.icon).toBe("string");
      });
    });
  });

  describe("materialCompositions", () => {
    it("has compositions with required properties", () => {
      expect(materialCompositions.length).toBeGreaterThan(0);
      
      materialCompositions.forEach((composition) => {
        expect(composition).toHaveProperty("id");
        expect(composition).toHaveProperty("name");
        expect(composition).toHaveProperty("code");
        expect(composition).toHaveProperty("categoryId");
      });
    });

    it("has plastic compositions with correct codes", () => {
      const plastics = materialCompositions.filter(
        (c) => c.categoryId === "plastic"
      );
      
      expect(plastics.length).toBeGreaterThan(0);
      expect(plastics.some((p) => p.code === "PET 1")).toBe(true);
      expect(plastics.some((p) => p.code === "HDPE 2")).toBe(true);
    });

    it("has glass compositions with correct codes", () => {
      const glass = materialCompositions.filter((c) => c.categoryId === "glass");
      
      expect(glass.length).toBe(4); // colorless, green, brown, black
      expect(glass.some((g) => g.code === "GL 70")).toBe(true);
      expect(glass.some((g) => g.code === "GL 71")).toBe(true);
    });

    it("has composite materials with C/ prefix codes", () => {
      const composites = materialCompositions.filter(
        (c) => c.categoryId === "composite"
      );
      
      expect(composites.length).toBeGreaterThan(0);
      composites.forEach((composite) => {
        expect(composite.code).toMatch(/^C\/__\d+$/);
      });
    });

    it("has metal compositions with correct codes", () => {
      const metals = materialCompositions.filter(
        (c) => c.categoryId === "metal"
      );
      
      expect(metals.length).toBe(3); // FE, ALU, TIN
      expect(metals.some((m) => m.code === "FE 40")).toBe(true);
      expect(metals.some((m) => m.code === "ALU 41")).toBe(true);
    });
  });

  describe("materialCategories", () => {
    it("has individual and composite sections", () => {
      const headers = materialCategories.filter((c) => c.isHeader);
      expect(headers.length).toBe(2);
      
      const individualHeader = headers.find((h) => h.id === "individual");
      const compositeHeader = headers.find((h) => h.id === "composite_header");
      
      expect(individualHeader).toBeDefined();
      expect(compositeHeader).toBeDefined();
    });

    it("has main material categories", () => {
      const categoryIds = materialCategories.map((c) => c.id);
      
      expect(categoryIds).toContain("plastic");
      expect(categoryIds).toContain("paper");
      expect(categoryIds).toContain("metal");
      expect(categoryIds).toContain("glass");
      expect(categoryIds).toContain("wood");
    });
  });

  describe("disposalMethods", () => {
    it("has expected disposal methods", () => {
      expect(disposalMethods.length).toBeGreaterThan(0);
      
      const ids = disposalMethods.map((d) => d.id);
      expect(ids).toContain("glass_collection");
      expect(ids).toContain("plastic_collection");
      expect(ids).toContain("paper_collection");
    });

    it("has required properties", () => {
      disposalMethods.forEach((method) => {
        expect(method).toHaveProperty("id");
        expect(method).toHaveProperty("name");
        expect(typeof method.id).toBe("string");
        expect(typeof method.name).toBe("string");
      });
    });
  });

  describe("getCompositionsByCategory", () => {
    it("returns individual and composite groupings", () => {
      const result = getCompositionsByCategory();
      
      expect(result).toHaveProperty("individual");
      expect(result).toHaveProperty("composite");
      expect(Array.isArray(result.individual)).toBe(true);
      expect(Array.isArray(result.composite)).toBe(true);
    });

    it("groups individual materials by category", () => {
      const result = getCompositionsByCategory();
      
      const plasticCategory = result.individual.find((c) => c.id === "plastic");
      expect(plasticCategory).toBeDefined();
      expect(plasticCategory?.compositions.length).toBeGreaterThan(0);
      
      const glassCategory = result.individual.find((c) => c.id === "glass");
      expect(glassCategory).toBeDefined();
      expect(glassCategory?.compositions.length).toBe(4);
    });

    it("groups composite materials correctly", () => {
      const result = getCompositionsByCategory();
      
      expect(result.composite.length).toBe(1);
      expect(result.composite[0].id).toBe("composite");
      expect(result.composite[0].compositions.length).toBeGreaterThan(0);
    });

    it("excludes empty categories", () => {
      const result = getCompositionsByCategory();
      
      result.individual.forEach((category) => {
        expect(category.compositions.length).toBeGreaterThan(0);
      });
    });
  });
});
