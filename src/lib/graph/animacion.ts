import type { Viewport } from "@xyflow/svelte";

type ControlVista = {
  setViewport: (viewport: Viewport, opciones?: { duration?: number }) => unknown;
  getViewport: () => Viewport;
};

type OpcionesAnimacion = {
  /** Duración en ms. 0 aplica la vista al instante. */
  duracion?: number;
  /** Cuánto se aleja como máximo a mitad de camino (0.1 = 10 % menos de zoom). */
  alejamiento?: number;
};

/** easeInOutSine: arranque y frenado suaves, sin la aceleración brusca de las cúbicas. */
const suavizar = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

let cancelarActual: (() => void) | null = null;

/**
 * Lleva la vista a `destino` desplazando el centro de la pantalla en línea recta con
 * una curva suave, y con un leve alejamiento a mitad de camino (proporcional a la
 * distancia) para dar contexto sin el "salto" exagerado del zoom de d3.
 * Se cancela si el usuario arrastra, hace scroll o toca la pantalla.
 */
export function animarVista(
  { setViewport, getViewport }: ControlVista,
  destino: Viewport,
  { duracion = 500, alejamiento = 0.05 }: OpcionesAnimacion = {},
): Promise<void> {
  cancelarActual?.();
  cancelarActual = null;

  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (duracion <= 0 || reducirMovimiento) {
    setViewport(destino, { duration: 0 });
    return Promise.resolve();
  }

  const inicio = getViewport();
  // Se interpola el punto del plano que queda en el centro de la pantalla, no el
  // transform: así el recorrido se ve recto aunque cambie el zoom.
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const x0 = (cx - inicio.x) / inicio.zoom;
  const y0 = (cy - inicio.y) / inicio.zoom;
  const x1 = (cx - destino.x) / destino.zoom;
  const y1 = (cy - destino.y) / destino.zoom;

  // Distancia en píxeles de pantalla: los saltos cortos casi no se alejan.
  const distancia = Math.hypot(x1 - x0, y1 - y0) * Math.min(inicio.zoom, destino.zoom);
  const profundidad = alejamiento * Math.min(1, distancia / window.innerWidth);
  const razonZoom = destino.zoom / inicio.zoom;

  return new Promise((resolver) => {
    let frame = 0;
    const t0 = performance.now();

    const terminar = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", cancelar, true);
      window.removeEventListener("pointerdown", cancelar, true);
      window.removeEventListener("touchstart", cancelar, true);
      if (cancelarActual === cancelar) cancelarActual = null;
      resolver();
    };
    function cancelar() {
      terminar();
    }

    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - t0) / duracion);
      const s = suavizar(t);
      const zoom = inicio.zoom * razonZoom ** s * (1 - profundidad * Math.sin(Math.PI * s));
      const x = x0 + (x1 - x0) * s;
      const y = y0 + (y1 - y0) * s;
      setViewport({ x: cx - x * zoom, y: cy - y * zoom, zoom }, { duration: 0 });
      if (t < 1) frame = requestAnimationFrame(paso);
      else {
        setViewport(destino, { duration: 0 });
        terminar();
      }
    };

    cancelarActual = cancelar;
    window.addEventListener("wheel", cancelar, { capture: true, passive: true });
    window.addEventListener("pointerdown", cancelar, { capture: true, passive: true });
    window.addEventListener("touchstart", cancelar, { capture: true, passive: true });
    frame = requestAnimationFrame(paso);
  });
}
