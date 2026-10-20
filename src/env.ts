import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  MATERIAS_APROBADAS_STORAGE_KEY: { public: true },
  AYUDA_VISTA_STORAGE_KEY: { public: true },
  PERFIL_LINKEDIN_URL: { public: true },
  PERFIL_GITHUB_URL: { public: true },
  CORREO_SOPORTE: { public: true },
});
