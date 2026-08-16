import { browser } from "$app/env";
import { GRAPH_STATE_STORAGE_KEY } from "$app/env/public";
import type { MateriaAprobada } from "#lib/graph/index.js";
import graph from "#lib/graph/state.svelte.js";

const DEBOUNCE_TIMEOUT_MS = 500;

type StoredGraphState = {
  materiasAprobadas: MateriaAprobada[];
};

let timeout: ReturnType<typeof setTimeout> | undefined;

const guardar = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem(
      GRAPH_STATE_STORAGE_KEY,
      JSON.stringify({ materiasAprobadas: graph.materiasAprobadas }),
    );
  }, DEBOUNCE_TIMEOUT_MS);
};

export const cambiarCalificacionMateria = (codigoMateria: string, calificacion: number | null) => {
  graph.cambiarCalificacionMateria(codigoMateria, calificacion);
  guardar();
};

if (browser) {
  const datosPersistidos = localStorage.getItem(GRAPH_STATE_STORAGE_KEY);
  if (datosPersistidos !== null) {
    console.info("se han encontrado datos persistidos en localStorage");
    const datos = JSON.parse(datosPersistidos) as StoredGraphState;
    graph.materiasAprobadas = datos.materiasAprobadas;
  } else {
    console.info("no se han encontrado datos persistidos en localStorage");
  }
}
