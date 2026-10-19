import { browser } from "$app/env";
import { MATERIAS_APROBADAS_STORAGE_KEY } from "$app/env/public";
import type { MateriaAprobada } from "#lib/graph/index.js";

export const cargarMateriasAprobadas = (): MateriaAprobada[] | null => {
  if (!browser) return null;

  const datosPersistidos = localStorage.getItem(MATERIAS_APROBADAS_STORAGE_KEY);
  if (datosPersistidos === null) return null;

  return JSON.parse(datosPersistidos) as MateriaAprobada[];
};

export const guardarMateriasAprobadas = (materiasAprobadas: MateriaAprobada[]) => {
};
