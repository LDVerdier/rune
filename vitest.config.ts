/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["app/domain/**", "app/hooks/**"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
