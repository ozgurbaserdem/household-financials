import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";
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
      unicorn,
    },
    rules: {
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      camelcase: [
        "error",
        {
          properties: "never",
          allow: ["^[A-Z][a-zA-Z_]*$"],
        },
      ],
      "unicorn/no-array-reduce": "error",
      "unicorn/no-array-for-each": "error",
      "no-var": "error",
      "prefer-const": "error",
      "unused-imports/no-unused-imports": "error",
      "prefer-arrow-callback": "error",
      "unicorn/no-for-loop": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/consistent-destructuring": "error",
      "unicorn/no-nested-ternary": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/no-array-index-key": "warn",
      "react/self-closing-comp": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForStatement",
          message:
            "Imperative for loops are not allowed. Use array methods instead.",
        },
        {
          selector: "ForInStatement",
          message:
            "Imperative for...in loops are not allowed. Use Object methods instead.",
        },
        {
          selector: "ForOfStatement",
          message:
            "Imperative for...of loops are not allowed. Use array methods instead.",
        },
        {
          selector: "WhileStatement",
          message:
            "Imperative while loops are not allowed. Use array methods instead.",
        },
        {
          selector: "DoWhileStatement",
          message:
            "Imperative do...while loops are not allowed. Use array methods instead.",
        },
      ],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            props: true,
            ref: true,
            params: true,
            args: true,
            env: true,
            ctx: true,
            req: true,
            res: true,
            db: true,
            fn: true,
            acc: true,
            prev: true,
            curr: true,
            temp: true,
            min: true,
            max: true,
            avg: true,
            str: true,
            num: true,
            obj: true,
            arr: true,
            doc: true,
            elem: true,
            el: true,
            btn: true,
            img: true,
            src: true,
            dest: true,
            config: true,
            proc: true,
            dev: true,
            prod: true,
            i18n: true,
            a11y: true,
            Props: true,
            e: true,
            err: true,
            idx: true,
            i: true,
            param: true,
            mod: true,
            val: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
