import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ["debug", "log", "info", "warn", "error"],
    },
  },
  plugins: [tailwindcss(), sveltekit({ adapter: adapter() })],
});
