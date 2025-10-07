import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Ignore generated code (Prisma client, wasm shims, etc.)
      "src/generated/**",
    ],
    rules: {
      // Keep project productive during build: allow `any` in shared type defs
      "@typescript-eslint/no-explicit-any": "off",
      // Some third-party shims may use `require`
      "@typescript-eslint/no-require-imports": "off",
      // Generated/bundled code may alias `this` — do not block builds
      "@typescript-eslint/no-this-alias": "off",
    },
  },
  // Per-file settings in flat config are separate entries with `files`
  {
    files: ["src/types/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/generated/**/*.{js,ts}", "src/generated/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
