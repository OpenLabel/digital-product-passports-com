import { describe, it, expect } from "vitest";
import { WINE_PASSPORT_FIELDS } from "./WinePublicPassport";

describe("WinePublicPassport", () => {
  describe("WINE_PASSPORT_FIELDS constant", () => {
    it("defines product info fields", () => {
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("volume");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("grape_variety");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("vintage");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("country");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("region");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("denomination");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("sugar_classification");
      expect(WINE_PASSPORT_FIELDS.productInfo).toContain("product_type");
    });

    it("defines nutritional fields", () => {
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("alcohol_percent");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("energy_kcal");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("energy_kj");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("carbohydrates");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("sugar");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("residual_sugar");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("total_acidity");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("glycerine");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("fat");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("saturated_fat");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("proteins");
      expect(WINE_PASSPORT_FIELDS.nutritional).toContain("salt");
    });

    it("defines ingredient fields", () => {
      expect(WINE_PASSPORT_FIELDS.ingredients).toContain("ingredients");
    });

    it("defines recycling fields", () => {
      expect(WINE_PASSPORT_FIELDS.recycling).toContain("recycling_components");
      expect(WINE_PASSPORT_FIELDS.recycling).toContain("recycling_pdf_url");
      expect(WINE_PASSPORT_FIELDS.recycling).toContain("recycling_website_url");
    });

    it("has all required field categories", () => {
      expect(WINE_PASSPORT_FIELDS).toHaveProperty("productInfo");
      expect(WINE_PASSPORT_FIELDS).toHaveProperty("nutritional");
      expect(WINE_PASSPORT_FIELDS).toHaveProperty("ingredients");
      expect(WINE_PASSPORT_FIELDS).toHaveProperty("recycling");
    });
  });

  describe("field coverage verification", () => {
    const allFields = [
      ...WINE_PASSPORT_FIELDS.productInfo,
      ...WINE_PASSPORT_FIELDS.nutritional,
      ...WINE_PASSPORT_FIELDS.ingredients,
      ...WINE_PASSPORT_FIELDS.recycling,
    ];

    it("covers all wine product info fields from schema", () => {
      const expectedProductFields = [
        "volume",
        "grape_variety",
        "vintage",
        "country",
        "region",
        "denomination",
        "sugar_classification",
        "product_type",
      ];
      
      expectedProductFields.forEach((field) => {
        expect(allFields).toContain(field);
      });
    });

    it("covers all nutritional fields from schema", () => {
      const expectedNutritionalFields = [
        "alcohol_percent",
        "energy_kcal",
        "energy_kj",
        "carbohydrates",
        "sugar",
        "residual_sugar",
        "total_acidity",
        "glycerine",
        "fat",
        "saturated_fat",
        "proteins",
        "salt",
      ];
      
      expectedNutritionalFields.forEach((field) => {
        expect(allFields).toContain(field);
      });
    });

    it("covers ingredients field", () => {
      expect(allFields).toContain("ingredients");
    });

    it("covers all recycling fields", () => {
      const expectedRecyclingFields = [
        "recycling_components",
        "recycling_pdf_url",
        "recycling_website_url",
      ];
      
      expectedRecyclingFields.forEach((field) => {
        expect(allFields).toContain(field);
      });
    });

    it("total field count matches expected", () => {
      // 8 product + 12 nutritional + 1 ingredients + 3 recycling = 24
      expect(allFields.length).toBe(24);
    });
  });

  describe("display options verification", () => {
    it("supports display option fields", () => {
      // These are display options, not data fields, but we verify the concept exists
      const displayOptions = [
        "show_exact_values",
        "group_small_quantities",
        "display_alcohol",
        "display_residual_sugar",
        "display_total_acidity",
      ];
      
      // Display options control visibility, they should NOT be in WINE_PASSPORT_FIELDS
      // as they are not displayable data fields themselves
      displayOptions.forEach((option) => {
        const allFields = [
          ...WINE_PASSPORT_FIELDS.productInfo,
          ...WINE_PASSPORT_FIELDS.nutritional,
          ...WINE_PASSPORT_FIELDS.ingredients,
          ...WINE_PASSPORT_FIELDS.recycling,
        ];
        expect(allFields).not.toContain(option);
      });
    });
  });

  describe("field groupings are logical", () => {
    it("productInfo only contains product identification fields", () => {
      WINE_PASSPORT_FIELDS.productInfo.forEach((field) => {
        const nutritionalFields = WINE_PASSPORT_FIELDS.nutritional;
        expect(nutritionalFields).not.toContain(field);
      });
    });

    it("nutritional only contains nutrition-related fields", () => {
      WINE_PASSPORT_FIELDS.nutritional.forEach((field) => {
        const productFields = WINE_PASSPORT_FIELDS.productInfo;
        expect(productFields).not.toContain(field);
      });
    });

    it("no duplicate fields across categories", () => {
      const allFields = [
        ...WINE_PASSPORT_FIELDS.productInfo,
        ...WINE_PASSPORT_FIELDS.nutritional,
        ...WINE_PASSPORT_FIELDS.ingredients,
        ...WINE_PASSPORT_FIELDS.recycling,
      ];
      
      const uniqueFields = new Set(allFields);
      expect(uniqueFields.size).toBe(allFields.length);
    });
  });
});
