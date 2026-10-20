import { defineConfig } from "vitest/config";

// Config aparte: los tests de lib no necesitan el plugin de SvelteKit.
export default defineConfig({ test: { include: ["src/**/*.test.ts"] } });
