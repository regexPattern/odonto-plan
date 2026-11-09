<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
  import { tick } from "svelte";
  import type { MateriaNodeType } from "#lib/graph/index.js";
  import { animarVista } from "#lib/graph/animacion.js";
  import { vistaParaAnio } from "#lib/graph/layout.js";
  import { PLAN } from "#lib/plan/index.js";

  let { id, data }: NodeProps<MateriaNodeType> = $props();
  const flow = useSvelteFlow();
  const { getNode, getViewport } = flow;

  async function asegurarVisible() {
    const anio = PLAN.anios.findIndex(({ materias }) =>
      materias.some(({ codigo }) => codigo === data.codigo),
    );
    if (anio === -1) return;
    const vista = vistaParaAnio(anio, window.innerWidth);
    // En mobile la ficha de la materia seleccionada tapa buena parte del viewport:
    // se espera a que se renderice para medir su borde superior.
    const esMobile = !window.matchMedia("(min-width: 1024px)").matches;
    if (esMobile) {
      await tick();
      await new Promise((resolver) => requestAnimationFrame(resolver));
    }
    const margenInferior = 100;
    let limite = window.innerHeight - margenInferior;
    if (esMobile) {
      const panel = document.querySelector("[data-panel-materia]");
      const arriba = panel?.getBoundingClientRect().top;
      if (arriba !== undefined && panel?.firstElementChild?.clientHeight) {
        limite = Math.min(limite, arriba - 50);
      }
    }
    const nodo = getNode(id);
    // Si la materia ya se ve completa, no se mueve la vista.
    if (nodo) {
      const actual = getViewport();
      const izquierda = nodo.position.x * actual.zoom + actual.x;
      const derecha = (nodo.position.x + data.width) * actual.zoom + actual.x;
      const arriba = nodo.position.y * actual.zoom + actual.y;
      const abajo = (nodo.position.y + data.height) * actual.zoom + actual.y;
      const visible =
        izquierda >= 0 && derecha <= window.innerWidth && arriba >= vista.y && abajo <= limite;
      if (visible) return;
    }
    // Parte de la vista original del año (encabezado visible) y solo sube el contenido
    // si la materia no entra, dejándola con margen contra el borde inferior.
    let y = vista.y;
    if (nodo) {
      const abajo = (nodo.position.y + data.height) * vista.zoom;
      y = Math.min(y, limite - abajo);
    }
    animarVista(flow, { ...vista, y });
  }

  const tieneCorrelativas = $derived(Boolean(PLAN.correlatividades[data.codigo]?.length));
  const tieneDependientes = $derived(
    Object.values(PLAN.correlatividades).some((correlativas) => correlativas.includes(data.codigo)),
  );
</script>

{#if tieneCorrelativas}
  <Handle type="target" position={Position.Left} class="z-10" />
{/if}

<div
  class={[
    "materia-superficie relative flex items-center justify-center border-2 px-3 py-2 text-center leading-tight font-medium motion-safe:transition-colors motion-safe:duration-500",
    data.estado,
    "aprobada:border-border-aprobada aprobada:bg-bg-aprobada aprobada:text-fg-aprobada",
    "desbloqueada:border-border-desbloqueada desbloqueada:bg-bg-desbloqueada desbloqueada:text-fg-desbloqueada",
    "bloqueada:border-dashed bloqueada:border-border-bloqueada bloqueada:bg-bg-bloqueada bloqueada:text-fg-bloqueada",
  ]}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
  onclick={asegurarVisible}
  role="presentation"
>
  {data.nombre}

  {#if data.estado === "aprobada" && data.calificacion !== null}
    <span
      class="absolute -top-3.5 -right-3.5 flex size-7 items-center justify-center rounded-full border-2 border-border-aprobada text-sm leading-none font-bold backdrop-blur-(--superficie-blur)"
    >
      {data.calificacion}
    </span>
  {/if}
</div>

{#if tieneDependientes}
  <Handle type="source" position={Position.Right} class="z-10" />
{/if}
