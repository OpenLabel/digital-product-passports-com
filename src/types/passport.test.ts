import { describe, it, expect } from "vitest";
import type { ProductCategory, Passport, PassportFormData } from "./passport";

describe("passport types", () => {
  describe("ProductCategory type", () => {
    it("includes wine category", () => {
      const category: ProductCategory = "wine";
      expect(category).toBe("wine");
    });

    it("includes battery category", () => {
      const category: ProductCategory = "battery";
      expect(category).toBe("battery");
    });

    it("includes textiles category", () => {
      const category: ProductCategory = "textiles";
      expect(category).toBe("textiles");
    });

    it("includes construction category", () => {
      const category: ProductCategory = "construction";
      expect(category).toBe("construction");
    });

    it("includes electronics category", () => {
      const category: ProductCategory = "electronics";
      expect(category).toBe("electronics");
    });

    it("includes iron_steel category", () => {
      const category: ProductCategory = "iron_steel";
      expect(category).toBe("iron_steel");
    });

    it("includes aluminum category", () => {
      const category: ProductCategory = "aluminum";
      expect(category).toBe("aluminum");
    });

    it("includes toys category", () => {
      const category: ProductCategory = "toys";
      expect(category).toBe("toys");
    });

    it("includes cosmetics category", () => {
      const category: ProductCategory = "cosmetics";
      expect(category).toBe("cosmetics");
    });

    it("includes furniture category", () => {
      const category: ProductCategory = "furniture";
      expect(category).toBe("furniture");
    });

    it("includes tires category", () => {
      const category: ProductCategory = "tires";
      expect(category).toBe("tires");
    });

    it("includes detergents category", () => {
      const category: ProductCategory = "detergents";
      expect(category).toBe("detergents");
    });

    it("includes other category", () => {
      const category: ProductCategory = "other";
      expect(category).toBe("other");
    });
  });

  describe("Passport interface", () => {
    it("accepts valid passport object", () => {
      const passport: Passport = {
        id: "123",
        user_id: "user-456",
        name: "Test Product",
        category: "wine",
        image_url: "https://example.com/image.jpg",
        description: "A test product description",
        language: "en",
        category_data: { vintage: "2020" },
        public_slug: "test-product",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };
      expect(passport.id).toBe("123");
      expect(passport.category).toBe("wine");
    });

    it("accepts passport with null image_url", () => {
      const passport: Passport = {
        id: "123",
        user_id: "user-456",
        name: "Test Product",
        category: "battery",
        image_url: null,
        description: "Description",
        language: "en",
        category_data: null,
        public_slug: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      expect(passport.image_url).toBeNull();
    });

    it("accepts passport with null description", () => {
      const passport: Passport = {
        id: "123",
        user_id: "user-456",
        name: "Test Product",
        category: "textiles",
        image_url: null,
        description: null,
        language: "fr",
        category_data: null,
        public_slug: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      expect(passport.description).toBeNull();
    });

    it("accepts complex category_data", () => {
      const passport: Passport = {
        id: "123",
        user_id: "user-456",
        name: "Complex Product",
        category: "electronics",
        image_url: null,
        description: null,
        language: "en",
        category_data: {
          manufacturer: "Test Corp",
          model: "X100",
          specs: {
            weight: 100,
            dimensions: { width: 10, height: 20 },
          },
          tags: ["eco", "certified"],
        },
        public_slug: "complex-product",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      expect(passport.category_data).toBeDefined();
    });
  });

  describe("PassportFormData interface", () => {
    it("accepts valid form data", () => {
      const formData: PassportFormData = {
        name: "New Product",
        category: "furniture",
        image_url: "https://example.com/img.png",
        description: "A new product",
        language: "en",
        category_data: {},
      };
      expect(formData.name).toBe("New Product");
      expect(formData.category).toBe("furniture");
    });

    it("accepts form data with null image_url", () => {
      const formData: PassportFormData = {
        name: "Product",
        category: "tires",
        image_url: null,
        description: "Description",
        language: "de",
        category_data: { size: "large" },
      };
      expect(formData.image_url).toBeNull();
    });

    it("accepts empty category_data object", () => {
      const formData: PassportFormData = {
        name: "Simple Product",
        category: "other",
        image_url: null,
        description: "",
        language: "en",
        category_data: {},
      };
      expect(formData.category_data).toEqual({});
    });

    it("accepts all product categories in form data", () => {
      const categories: ProductCategory[] = [
        "wine",
        "battery",
        "textiles",
        "construction",
        "electronics",
        "iron_steel",
        "aluminum",
        "toys",
        "cosmetics",
        "furniture",
        "tires",
        "detergents",
        "other",
      ];

      categories.forEach((category) => {
        const formData: PassportFormData = {
          name: `${category} product`,
          category,
          image_url: null,
          description: "",
          language: "en",
          category_data: {},
        };
        expect(formData.category).toBe(category);
      });
    });
  });
});
