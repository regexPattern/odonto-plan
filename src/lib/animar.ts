import { motion } from "@withicons/motion/runtime";
import type { Action } from "svelte/action";

/**
 * Animación de ícono al hover/foco de su `.wm-trigger` más cercano; termina aunque se salga el
 * puntero. El foco sólo dispara si es visible (teclado): al cerrar un popover el foco vuelve al
 * botón y no debe reanimar el ícono.
 */
export const animar: Action<HTMLElement, { nombre: string; preset?: string }> = (node, opciones) => {
  const disparador = node.closest<HTMLElement>(".wm-trigger") ?? node;
  const filtrarFoco = (e: FocusEvent) => {
    if (!(e.target as HTMLElement).matches(":focus-visible")) e.stopImmediatePropagation();
  };
  // Se registra antes que los listeners de motion() para poder cortarlos.
  disparador.addEventListener("focusin", filtrarFoco);
  const handle = motion(node, opciones.nombre, {
    trigger: "hover",
    ...(opciones.preset && { preset: opciones.preset }),
  } as Parameters<typeof motion>[2]);
  return {
    destroy: () => {
      handle.destroy();
      disparador.removeEventListener("focusin", filtrarFoco);
    },
  };
};
