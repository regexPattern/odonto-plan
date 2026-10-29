import type { Viewport } from "@xyflow/svelte";
import { guardarPersistido, leerPersistido } from "#lib/storage.js";
import { MAX_ZOOM, MIN_ZOOM } from "./layout.js";

export const VIEWPORT_KEY = "odonto-plan:viewport";
export const VISTA_CBC: Viewport = { x: 0, y: 100, zoom: 1 };

export function cargarViewport(): Viewport {
  try {
    const { x, y, zoom } = JSON.parse(leerPersistido(VIEWPORT_KEY) ?? "null");
    const valido = [x, y, zoom].every(Number.isFinite) && zoom >= MIN_ZOOM && zoom <= MAX_ZOOM;
    return valido ? { x, y, zoom } : VISTA_CBC;
  } catch {
    return VISTA_CBC;
  }
}

export function guardarViewport(vista: Viewport) {
  try {
    guardarPersistido(VIEWPORT_KEY, JSON.stringify(vista));
  } catch {}
}
