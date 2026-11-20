import { defineConfig } from "vitest/config";

// Lets tests use the same "@/" imports as the app (see tsconfig.json paths).
const vitestConfig = defineConfig({
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
});

export default vitestConfig;
