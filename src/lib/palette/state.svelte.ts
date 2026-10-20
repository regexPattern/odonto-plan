import { browser } from "$app/env";
import { registrarPreferencias, track } from "#lib/analytics.js";
import { guardarPersistido, leerPersistido } from "#lib/storage.js";
import { esPaletaId, PALETA_POR_DEFECTO, PALETA_STORAGE_KEY, type PaletaId } from "./index.js";

const inicial = (): PaletaId => {
  if (!browser) return PALETA_POR_DEFECTO;
  try {
    const guardada = leerPersistido(PALETA_STORAGE_KEY);
    return esPaletaId(guardada) ? guardada : PALETA_POR_DEFECTO;
  } catch {
    return PALETA_POR_DEFECTO;
  }
};

class PaletaState {
  actual = $state<PaletaId>(inicial());

  elegir(id: PaletaId) {
    this.actual = id;
    document.documentElement.dataset.palette = id;
    guardarPersistido(PALETA_STORAGE_KEY, id);
    registrarPreferencias({ paleta: id });
    track({ nombre: "paleta_elegida", paleta: id });
  }
}

export default new PaletaState();
