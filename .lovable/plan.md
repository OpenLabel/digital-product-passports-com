

# Testing Infrastructure with Coverage Enforcement

## Goal
Set up automated testing that **fails the build** if:
- Any test fails
- Code coverage drops below 80%

---

## Phase 1: Install Dependencies

Add to `package.json` devDependencies:
```json
"@testing-library/jest-dom": "^6.6.0",
"@testing-library/react": "^16.0.0",
"@vitest/coverage-v8": "^3.2.4",
"jsdom": "^20.0.3",
"vitest": "^3.2.4"
```

---

## Phase 2: Create Vitest Configuration

New file: `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/components/ui/",  // shadcn components
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

---

## Phase 3: Create Test Setup

New file: `src/test/setup.ts`

```typescript
import "@testing-library/jest-dom";

// Mock browser APIs not available in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
```

---

## Phase 4: Update Build Scripts

Update `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "build": "vitest run --coverage && vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

**Key change**: `build` now runs `vitest run --coverage && vite build`
- Tests must pass first
- Coverage must meet 80% threshold
- Only then does the actual build proceed

---

## Phase 5: Update TypeScript Config

Add to `tsconfig.app.json` compilerOptions:

```json
"types": ["vitest/globals"]
```

---

## Phase 6: Create Initial Tests

### File: `src/data/wineIngredients.test.ts`

Tests for ingredient data utilities:
- `getAllIngredients()` returns complete list
- `getIngredientById()` finds correct ingredient
- `getIngredientById()` returns undefined for invalid ID
- Allergen ingredients have correct flags
- E-numbers are properly formatted

### File: `src/data/wineRecycling.test.ts`

Tests for recycling data utilities:
- Material categories are correctly grouped
- Material codes follow expected format
- Composite materials are properly categorized

### File: `src/templates/index.test.ts`

Tests for template system:
- `getTemplate('wine')` returns wine template
- `getTemplate('battery')` returns battery template
- Unknown category falls back to "other" template
- All templates have required structure

---

## How It Works After Implementation

```text
Developer runs: npm run build

Step 1: vitest run --coverage
        ├── Run all *.test.ts files
        ├── Calculate coverage percentages
        ├── If any test fails → BUILD FAILS ❌
        └── If coverage < 80% → BUILD FAILS ❌

Step 2: vite build (only if Step 1 passes)
        └── Compile production bundle ✅
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `package.json` | Modify - add dependencies and scripts |
| `vitest.config.ts` | Create - test configuration |
| `src/test/setup.ts` | Create - test environment setup |
| `tsconfig.app.json` | Modify - add vitest types |
| `src/data/wineIngredients.test.ts` | Create - ingredient tests |
| `src/data/wineRecycling.test.ts` | Create - recycling tests |
| `src/templates/index.test.ts` | Create - template tests |

---

## Important Notes

1. **shadcn/ui components excluded** - These are third-party, no need to test them
2. **Coverage starts at data/templates** - These are pure functions, easiest to test
3. **Gradual increase** - Start with 80%, can increase to 90% later
4. **Watch mode available** - `npm run test:watch` for development

