// packages/core/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node", // no necesitas jsdom aquí, no hay DOM que simular
        globals: true,
    },
});
