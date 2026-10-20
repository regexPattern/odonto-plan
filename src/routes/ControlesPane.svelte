<script lang="ts">
  import RotateCcw from "@withicons/svelte/kawaii/icons/rotate-ccw";
  import ZoomIn from "@withicons/svelte/kawaii/icons/zoom-in";
  import ZoomOut from "@withicons/svelte/kawaii/icons/zoom-out";
  import { useSvelteFlow } from "@xyflow/svelte";
  import { untrack } from "svelte";
  import { vistaParaAnio } from "#lib/graph/layout.js";
  import graph from "#lib/graph/state.svelte.js";
  import { PLAN } from "#lib/plan/index.js";

  // `listo`: el progreso local ya se cargó, así que se sabe cuál es el año actual.
  let { listo }: { listo: boolean } = $props();
  const { setViewport, zoomIn, zoomOut } = useSvelteFlow();
  const options = { duration: 200 };

  // Primer año con alguna materia sin aprobar (el año "actual" de cursada).
  function restablecerVista(opciones: { duration: number } = options) {
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
    setViewport(vistaParaAnio(anio, window.innerWidth), opciones);
  }

  // En pantallas angostas arranca en el año actual y con el zoom ajustado.
  $effect(() => {
    if (listo && window.innerWidth < 1024) untrack(() => restablecerVista({ duration: 0 }));
  });
</script>

<div class="flex items-center gap-1.5 sm:gap-2" role="group" aria-label="Controles de vista">
  <!-- En mobile alcanza con el gesto de pellizcar. -->
  <button
    type="button"
    class="boton-herramienta max-sm:hidden!"
    aria-label="Acercar"
    title="Acercar"
    onclick={() => zoomIn(options)}
  >
    <ZoomIn size={24} />
  </button>
  <button
    type="button"
    class="boton-herramienta max-sm:hidden!"
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
    onclick={() => restablecerVista()}
  >
    <RotateCcw size={24} />
  </button>
</div>
