import { browser } from "$app/env";
import { MATERIAS_APROBADAS_STORAGE_KEY } from "$app/env/public";
import type { MateriaAprobada } from "#lib/graph/index.js";
import { guardarPersistido, leerPersistido } from "#lib/storage.js";

export const cargarMateriasAprobadas = (): MateriaAprobada[] | null => {
  if (!browser) return null;

  try {
    const datosPersistidos = leerPersistido(MATERIAS_APROBADAS_STORAGE_KEY);
    if (datosPersistidos === null) return null;

    const datos: unknown = JSON.parse(datosPersistidos);
    if (!Array.isArray(datos)) return null;
    return datos.filter(
      (materia): materia is MateriaAprobada =>
        materia !== null &&
        typeof materia === "object" &&
        typeof materia.codigo === "string" &&
        typeof materia.calificacion === "number",
    );
  } catch {
    return null;
  }
};

export const guardarMateriasAprobadas = (materiasAprobadas: MateriaAprobada[]) => {
  guardarPersistido(MATERIAS_APROBADAS_STORAGE_KEY, JSON.stringify(materiasAprobadas));
};
