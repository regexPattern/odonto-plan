export const PALETAS = [
  { id: "default", nombre: "Fucsia y verde azulado" },
  { id: "oceano", nombre: "Océano" },
  { id: "bosque", nombre: "Bosque" },
  { id: "atardecer", nombre: "Atardecer" },
] as const;

export type PaletaId = (typeof PALETAS)[number]["id"];

export const PALETA_POR_DEFECTO: PaletaId = "default";
export const PALETA_STORAGE_KEY = "odonto-plan:paleta";

export const esPaletaId = (valor: unknown): valor is PaletaId =>
  PALETAS.some(({ id }) => id === valor);
