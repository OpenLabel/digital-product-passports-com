import { describe, it, expect } from "vitest";
import type { TemplateQuestion, TemplateSection, CategoryTemplate } from "./base";
import { BaseTemplate } from "./base";

describe("base template types", () => {
  describe("TemplateQuestion interface", () => {
    it("accepts valid text question", () => {
      const question: TemplateQuestion = {
        id: "test",
        label: "Test Question",
        type: "text",
      };
      expect(question.type).toBe("text");
    });

    it("accepts valid textarea question", () => {
      const question: TemplateQuestion = {
        id: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter description",
      };
      expect(question.type).toBe("textarea");
      expect(question.placeholder).toBe("Enter description");
    });

    it("accepts valid select question with options", () => {
      const question: TemplateQuestion = {
        id: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ],
      };
      expect(question.type).toBe("select");
      expect(question.options).toHaveLength(2);
    });

    it("accepts valid checkbox question", () => {
      const question: TemplateQuestion = {
        id: "agree",
        label: "I agree",
        type: "checkbox",
        required: true,
      };
      expect(question.type).toBe("checkbox");
      expect(question.required).toBe(true);
    });

    it("accepts valid number question", () => {
      const question: TemplateQuestion = {
        id: "quantity",
        label: "Quantity",
        type: "number",
        helpText: "Enter the quantity",
      };
      expect(question.type).toBe("number");
      expect(question.helpText).toBe("Enter the quantity");
    });

    it("handles all optional properties", () => {
      const question: TemplateQuestion = {
        id: "full",
        label: "Full Question",
        type: "select",
        options: [{ value: "1", label: "One" }],
        placeholder: "Select one",
        required: true,
        helpText: "Help text here",
      };
      expect(question.options).toBeDefined();
      expect(question.placeholder).toBeDefined();
      expect(question.required).toBeDefined();
      expect(question.helpText).toBeDefined();
    });
  });

  describe("TemplateSection interface", () => {
    it("accepts valid section with questions", () => {
      const section: TemplateSection = {
        title: "Basic Info",
        questions: [
          { id: "name", label: "Name", type: "text" },
          { id: "email", label: "Email", type: "text" },
        ],
      };
      expect(section.title).toBe("Basic Info");
      expect(section.questions).toHaveLength(2);
    });

    it("accepts section with description", () => {
      const section: TemplateSection = {
        title: "Advanced",
        description: "Advanced configuration options",
        questions: [],
      };
      expect(section.description).toBe("Advanced configuration options");
    });

    it("accepts section with empty questions array", () => {
      const section: TemplateSection = {
        title: "Empty Section",
        questions: [],
      };
      expect(section.questions).toHaveLength(0);
    });
  });

  describe("CategoryTemplate interface", () => {
    it("accepts valid template structure", () => {
      const template: CategoryTemplate = {
        id: "test",
        name: "Test Template",
        description: "A test template",
        icon: "📦",
        sections: [],
      };
      expect(template.id).toBe("test");
      expect(template.name).toBe("Test Template");
      expect(template.icon).toBe("📦");
    });

    it("accepts template with getRequiredLogos function", () => {
      const template: CategoryTemplate = {
        id: "test",
        name: "Test",
        description: "Test description",
        icon: "🔧",
        sections: [],
        getRequiredLogos: (data) => {
          if (data.hasLogo) return ["logo1", "logo2"];
          return [];
        },
      };
      expect(template.getRequiredLogos?.({ hasLogo: true })).toEqual(["logo1", "logo2"]);
      expect(template.getRequiredLogos?.({ hasLogo: false })).toEqual([]);
    });
  });

  describe("BaseTemplate abstract class", () => {
    it("can be extended with concrete implementation", () => {
      class TestTemplate extends BaseTemplate {
        id = "test";
        name = "Test";
        description = "Test description";
        icon = "🧪";
        sections: TemplateSection[] = [
          {
            title: "Test Section",
            questions: [{ id: "q1", label: "Question 1", type: "text" }],
          },
        ];

        getRequiredLogos(): string[] {
          return ["test-logo"];
        }
      }

      const template = new TestTemplate();
      expect(template.id).toBe("test");
      expect(template.name).toBe("Test");
      expect(template.sections).toHaveLength(1);
      expect(template.getRequiredLogos?.()).toEqual(["test-logo"]);
    });

    it("extended class without getRequiredLogos is valid", () => {
      class MinimalTemplate extends BaseTemplate {
        id = "minimal";
        name = "Minimal";
        description = "Minimal template";
        icon = "📋";
        sections: TemplateSection[] = [];
        getRequiredLogos = undefined;
      }

      const template = new MinimalTemplate();
      expect(template.id).toBe("minimal");
      expect(template.getRequiredLogos).toBeUndefined();
    });
  });
});
