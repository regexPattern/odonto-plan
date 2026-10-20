import { browser } from "$app/env";
import { esPaletaId, PALETA_POR_DEFECTO, PALETA_STORAGE_KEY, type PaletaId } from "./index.js";

const inicial = (): PaletaId => {
  if (!browser) return PALETA_POR_DEFECTO;
  const guardada = localStorage.getItem(PALETA_STORAGE_KEY);
  return esPaletaId(guardada) ? guardada : PALETA_POR_DEFECTO;
};

class PaletaState {
  actual = $state<PaletaId>(inicial());

  elegir(id: PaletaId) {
    this.actual = id;
    document.documentElement.dataset.palette = id;
    localStorage.setItem(PALETA_STORAGE_KEY, id);
  }
}

export default new PaletaState();
