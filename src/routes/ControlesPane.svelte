<script lang="ts">
  import RotateCcw from "@withicons/svelte/kawaii/icons/rotate-ccw";
  import ZoomIn from "@withicons/svelte/kawaii/icons/zoom-in";
  import ZoomOut from "@withicons/svelte/kawaii/icons/zoom-out";
  import { useSvelteFlow, type Viewport } from "@xyflow/svelte";

  let { initialViewport }: { initialViewport: Viewport } = $props();
  const { setViewport, zoomIn, zoomOut } = useSvelteFlow();
  const options = { duration: 200 };
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
    onclick={() => setViewport(initialViewport, options)}
  >
    <RotateCcw size={24} />
  </button>
</div>

<style>
  .controles-pane :global(.wm-deco) {
    display: none;
  }
</style>
