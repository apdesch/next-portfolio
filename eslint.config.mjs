import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const projectStyleRestrictions = [
  {
    selector: "FunctionDeclaration",
    message: "Use a const arrow function: const name = () => {}.",
  },
  {
    selector: "FunctionExpression",
    message: "Use a const arrow function: const name = () => {}.",
  },
  {
    selector: "ExportDefaultDeclaration:not([declaration.type='Identifier'])",
    message: "Declare it first, then end the module with export default name;",
  },
  {
    selector: "Program > ExportDefaultDeclaration:not(:last-child)",
    message: "export default must be the last statement in the module.",
  },
  {
    selector: "ExportNamedDeclaration[exportKind='value'][specifiers.length>0]",
    message: "Only export default name; is allowed (types may be exported).",
  },
];

const valueExportRestriction = {
  selector: "ExportNamedDeclaration[declaration.type='VariableDeclaration']",
  message: "Only export default name; is allowed (types may be exported).",
};

// Next.js only reads these when they are named exports of a page or layout.
const nextRequiredExportNames =
  "metadata|generateMetadata|viewport|generateViewport|generateStaticParams|alt|size|contentType|GET|POST";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        ...projectStyleRestrictions,
        valueExportRestriction,
      ],
      "import/prefer-default-export": ["error", { target: "any" }],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...projectStyleRestrictions,
        {
          ...valueExportRestriction,
          selector: `${valueExportRestriction.selector}:not([declaration.declarations.0.id.name=/^(${nextRequiredExportNames})$/])`,
        },
      ],
    },
  },
  // Next.js route handlers export one function per HTTP method and never a default.
  {
    files: ["src/app/**/route.ts"],
    rules: { "import/prefer-default-export": "off" },
  },
  // Must come last so it can switch off formatting rules from the configs above.
  prettier,
  // After prettier, which turns curly off: single-line ifs skip braces, multi-line ifs need them.
  { rules: { curly: ["error", "multi-line"] } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
