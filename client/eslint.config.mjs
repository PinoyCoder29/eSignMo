// .eslintrc.cjs or .eslintrc.js (kung ESM, pwede .mjs)

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get directory name for compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat instance for Next.js ESLint config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Global ignores and rules
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/generated/**",
      "src/generated/**",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Override rules for generated files (Prisma/GraphQL)
  {
    files: ["prisma/generated/**", "src/generated/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-array-constructor": "off",
    },
  },
];

export default eslintConfig;
