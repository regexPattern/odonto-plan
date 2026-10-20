import { browser } from "$app/env";
import { POSTHOG_HOST, POSTHOG_KEY } from "$app/env/public";
import posthog from "posthog-js";

type Evento =
  | { nombre: "$pageview" }
  | { nombre: "paleta_elegida"; paleta: string }
  | { nombre: "modo_elegido"; modo: string }
  | { nombre: "ayuda_opcion_clic"; opcion: string }
  | { nombre: "sync_copiado"; tipo: "enlace" | "codigo" }
  | { nombre: "sync_previsualizado"; origen: "pegado" | "enlace"; materias: number }
  | { nombre: "sync_aplicado"; materias: number }
  | { nombre: "sync_revertido" }
  | { nombre: "sync_error"; etapa: "previsualizar" | "guardar" | "copiar"; mensaje: string }
  | { nombre: "enlace_social_clic"; red: "github" | "linkedin" };

let activo = false;

// Solo en producción: en `vite dev` no se contamina la analítica.
export function iniciarAnalytics() {
  if (!browser || activo || import.meta.env.DEV || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    person_profiles: "identified_only",
  });
  activo = true;
}

export function registrarPreferencias(props: { paleta?: string; modo?: string }) {
  if (activo) posthog.register(props);
}

export function track({ nombre, ...props }: Evento) {
  iniciarAnalytics();
  if (activo)
    posthog.capture(nombre, {
      ...props,
      $current_url: window.location.origin + window.location.pathname,
    });
}
