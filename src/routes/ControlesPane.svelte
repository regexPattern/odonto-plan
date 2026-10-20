<script lang="ts">
  import RotateCcw from "@withicons/svelte/kawaii/icons/rotate-ccw";
  import ZoomIn from "@withicons/svelte/kawaii/icons/zoom-in";
  import ZoomOut from "@withicons/svelte/kawaii/icons/zoom-out";
  import { useSvelteFlow, type Viewport } from "@xyflow/svelte";
  import { ANIO_GAP_X, ANUAL_WIDTH } from "#lib/graph/layout.js";
  import graph from "#lib/graph/state.svelte.js";
  import { PLAN } from "#lib/plan/index.js";

  let { initialViewport }: { initialViewport: Viewport } = $props();
  const { setViewport, zoomIn, zoomOut } = useSvelteFlow();
  const options = { duration: 200 };

  // Primer año con alguna materia sin aprobar (el año "actual" de cursada).
  function restablecerVista() {
    const aprobadas = new Set(graph.materiasAprobadas.map(({ codigo }) => codigo));
    // Las electivas no cuentan: no hace falta aprobarlas todas.
    const obligatorios = PLAN.anios.filter(({ materias }) =>
      materias.some((m) => m.cuatriInicial !== null),
    );
    let anio = obligatorios.findIndex(({ materias }) =>
      materias.some(({ codigo }) => !aprobadas.has(codigo)),
    );
    // Carrera completa: va a la última columna (electivas).
    if (anio === -1) anio = PLAN.anios.length - 1;
    // Centra horizontalmente la columna del año (el canvas ocupa todo el ancho).
    const { zoom } = initialViewport;
    const x = window.innerWidth / 2 - (anio * ANIO_GAP_X + ANUAL_WIDTH / 2) * zoom;
    setViewport({ ...initialViewport, x }, options);
  }
</script>

<div class="controles-pane flex items-center gap-2" role="group" aria-label="Controles de vista">
  <button
    type="button"
    class="boton-herramienta"
    aria-label="Acercar"
    title="Acercar"
    onclick={() => zoomIn(options)}
  >
    <ZoomIn size={24} />
  </button>
  <button
    type="button"
    class="boton-herramienta"
    aria-label="Alejar"
    title="Alejar"
    onclick={() => zoomOut(options)}
  >
    <ZoomOut size={24} />
  </button>
  <button
    type="button"
    class="boton-herramienta"
    aria-label="Restablecer vista"
    title="Restablecer vista"
    onclick={restablecerVista}
  >
    <RotateCcw size={24} />
  </button>
</div>

<style>
  .controles-pane :global(.wm-deco) {
    display: none;
  }
</style>
