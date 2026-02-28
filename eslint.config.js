import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
  {
    ignores: ["build/**", ".react-router/**", "node_modules/**"],
  },
  ...tseslint.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"],
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
);
