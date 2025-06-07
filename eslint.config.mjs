import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "react/jsx-curly-spacing": "off",
      "unused-imports/no-unused-imports": "error",

      // Function style conventions
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression", { allowArrowFunctions: true }],

      // React specific conventions
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],

      // Basic naming conventions (allow underscores and PascalCase for imports)
      camelcase: [
        "error",
        {
          properties: "never",
          allow: ["^[A-Z][a-zA-Z_]*$"],
        },
      ],
    },
  },
];

export default eslintConfig;
