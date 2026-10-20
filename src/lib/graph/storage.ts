import { browser } from "$app/env";
import { MATERIAS_APROBADAS_STORAGE_KEY } from "$app/env/public";
import type { MateriaAprobada } from "#lib/graph/index.js";
import { guardarPersistido, leerPersistido } from "#lib/storage.js";

export const cargarMateriasAprobadas = (): MateriaAprobada[] | null => {
  if (!browser) return null;

  try {
    const datosPersistidos = leerPersistido(MATERIAS_APROBADAS_STORAGE_KEY);
    if (datosPersistidos === null) return null;

    return JSON.parse(datosPersistidos) as MateriaAprobada[];
  } catch {
    return null;
  }
};

export const guardarMateriasAprobadas = (materiasAprobadas: MateriaAprobada[]) => {
  guardarPersistido(MATERIAS_APROBADAS_STORAGE_KEY, JSON.stringify(materiasAprobadas));
};
