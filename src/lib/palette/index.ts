export const PALETAS = [
  { id: "default" },
  { id: "blue-amber" },
  { id: "emerald-lime" },
  { id: "orange-violet" },
] as const;

export type PaletaId = (typeof PALETAS)[number]["id"];

export const PALETA_POR_DEFECTO: PaletaId = "default";
export const PALETA_STORAGE_KEY = "odonto-plan:paleta";

// Conservar las preferencias guardadas antes del cambio de identificadores.
export const PALETAS_LEGACY: Record<string, PaletaId> = {
  oceano: "blue-amber",
  bosque: "emerald-lime",
  atardecer: "orange-violet",
};

export const esPaletaId = (valor: unknown): valor is PaletaId =>
  PALETAS.some(({ id }) => id === valor);
