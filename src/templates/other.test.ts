import { describe, it, expect } from "vitest";
import { OtherTemplate, otherTemplate } from "./other";
import { BaseTemplate } from "./base";

describe("OtherTemplate", () => {
  describe("class definition", () => {
    it("extends BaseTemplate", () => {
      expect(otherTemplate).toBeInstanceOf(BaseTemplate);
    });

    it("has correct id", () => {
      expect(otherTemplate.id).toBe("other");
    });

    it("has correct name", () => {
      expect(otherTemplate.name).toBe("Other");
    });

    it("has correct description", () => {
      expect(otherTemplate.description).toBe(
        "Generic Digital Product Passport for any product type"
      );
    });

    it("has correct icon", () => {
      expect(otherTemplate.icon).toBe("📦");
    });

    it("has empty sections array", () => {
      expect(otherTemplate.sections).toEqual([]);
      expect(otherTemplate.sections).toHaveLength(0);
    });
  });

  describe("getRequiredLogos", () => {
    it("returns empty array", () => {
      const result = otherTemplate.getRequiredLogos();
      expect(result).toEqual([]);
    });

    it("returns empty array regardless of input", () => {
      const result = otherTemplate.getRequiredLogos();
      expect(result).toHaveLength(0);
    });
  });

  describe("exported instance", () => {
    it("otherTemplate is an instance of OtherTemplate", () => {
      expect(otherTemplate).toBeInstanceOf(OtherTemplate);
    });

    it("can create new instance of OtherTemplate", () => {
      const newInstance = new OtherTemplate();
      expect(newInstance.id).toBe("other");
      expect(newInstance.name).toBe("Other");
    });

    it("multiple instances have same values", () => {
      const instance1 = new OtherTemplate();
      const instance2 = new OtherTemplate();
      expect(instance1.id).toBe(instance2.id);
      expect(instance1.name).toBe(instance2.name);
      expect(instance1.description).toBe(instance2.description);
    });
  });
});
