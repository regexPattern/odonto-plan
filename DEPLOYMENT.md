# Deploy en Cloudflare

Sitio prerenderizado con SvelteKit y `adapter-static`, servido por Workers Static Assets. No requiere backend ni cambiar el adaptador. Wrangler publica únicamente `build/`; no publica el archivo `.env`.

Wrangler no está instalado como dependencia del proyecto y no hay comandos locales de deploy. Cloudflare lo descarga únicamente en su entorno de build mediante `npx`, con una versión fijada en los comandos de publicación.

## Auto deploys desde GitHub (Workers Builds)

La conexión se autoriza una vez en Cloudflare; no se activa solo por agregar `wrangler.jsonc` al repositorio.

1. Sube estos cambios a `regexPattern/odonto-plan`.
2. En Cloudflare → **Workers & Pages**, crea un Worker mediante **Import a repository** y autoriza GitHub. Si ya hiciste un deploy manual, abre el Worker → **Settings → Builds → Connect**.
3. Selecciona el repositorio y configura:

   | Ajuste                                                          | Valor                                         |
   | --------------------------------------------------------------- | --------------------------------------------- |
   | Nombre del Worker                                               | `odonto-plan` (igual que en `wrangler.jsonc`) |
   | Rama de producción                                              | `main`                                        |
   | Directorio raíz                                                 | Raíz del repositorio                          |
   | Build command                                                   | `pnpm build`                                  |
   | Deploy command                                                  | `npx --yes wrangler@4.151.2 deploy`           |
   | Preview/non-production deploy command, si habilitas otras ramas | `npx --yes wrangler@4.151.2 versions upload`  |

4. En **Build Variables and Secrets**, define `PNPM_VERSION=12.14.0`. Node se fija mediante `.node-version`. Cloudflare instala las dependencias automáticamente.
5. Copia las variables de la aplicación desde tu configuración actual a las **variables de build**, tanto para producción como para previews si las habilitas:

   - `MATERIAS_APROBADAS_STORAGE_KEY`
   - `AYUDA_VISTA_STORAGE_KEY`
   - `PERFIL_LINKEDIN_URL`
   - `PERFIL_GITHUB_URL`
   - `CORREO_SOPORTE`
   - `POSTHOG_KEY`
   - `POSTHOG_HOST`

   Todas están declaradas públicas en `src/env.ts` y quedan incorporadas en el JavaScript del sitio. No uses secretos privados; `POSTHOG_KEY` debe ser la clave pública del proyecto, no un token personal. No basta con definir estas variables en el runtime del Worker. Conserva las claves de almacenamiento existentes para mantener la compatibilidad con datos locales.

6. Guarda y ejecuta el primer build. Los siguientes pushes a `main` se desplegarán automáticamente. Las otras ramas solo generan versiones de preview si habilitas sus builds; no deben usar `wrangler deploy`.

No necesitas guardar un token de Cloudflare en GitHub ni crear un workflow de GitHub Actions al usar esta integración.

## Verificación y dominio

Prueba primero la URL `workers.dev` que devuelve Cloudflare: carga, recarga, progreso local, enlaces, sincronización y eventos de PostHog. El routing mantiene el comportamiento de sitio estático; no se añade un fallback SPA que oculte rutas inexistentes.

Después añade tu dominio en **Settings → Domains & Routes → Add → Custom Domain** y sigue las instrucciones de Cloudflare. Mantén Vercel disponible hasta validar el nuevo dominio y HTTPS. El almacenamiento local depende del origen: los datos del dominio de producción no aparecerán automáticamente en la URL de prueba `workers.dev`.

Referencias: [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) · [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) · [Static Assets](https://developers.cloudflare.com/workers/static-assets/).
