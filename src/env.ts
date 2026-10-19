import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  MATERIAS_APROBADAS_STORAGE_KEY: { public: true },
});
