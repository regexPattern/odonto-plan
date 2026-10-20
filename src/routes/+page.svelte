<script lang="ts">
  import Palette from "@withicons/svelte/kawaii/icons/palette";
  import "@xyflow/svelte/dist/style.css";
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import { onMount } from "svelte";
  import { nodeTypes } from "#lib/graph/index.js";
  import graph from "#lib/graph/state.svelte.js";
  import { cargarMateriasAprobadas } from "#lib/graph/storage.js";
  import ControlesPane from "./ControlesPane.svelte";
  import MateriaSeleccionada from "./MateriaSeleccionada.svelte";
  import ProgresoCarrera from "./ProgresoCarrera.svelte";
  import SincronizarProgreso from "./SincronizarProgreso.svelte";

  const INITIAL_VIEWPORT = { x: 0, y: 140, zoom: 1 };

  // SincronizarProgreso se monta recién cuando el progreso local ya está cargado.
  let cargado = $state(false);

  onMount(() => {
    const materiasAprobadas = cargarMateriasAprobadas();
    if (materiasAprobadas !== null) graph.materiasAprobadas = materiasAprobadas;
    cargado = true;
  });
</script>

<svelte:head>
  <title>Odonto Plan</title>
</svelte:head>

<div class="h-screen w-full">
  <SvelteFlow
    bind:nodes={graph.nodes}
    bind:edges={graph.edges}
    {nodeTypes}
    nodesFocusable={false}
    nodesDraggable={false}
    edgesFocusable={false}
    defaultEdgeOptions={{ selectable: false }}
    onnodeclick={(e) => {
      if (e.node.type === "materia") {
        graph.seleccionarMateria(e.node.data);
      } else {
        graph.deseleccionarMateria();
      }
    }}
    onpaneclick={() => graph.deseleccionarMateria()}
    colorMode="dark"
    initialViewport={INITIAL_VIEWPORT}
    minZoom={0.4}
    maxZoom={1}
  >
    <Panel position="top-left">
      <div
        class="flex items-center gap-3 border border-zinc-700/70 bg-[#141414]/50 p-2 backdrop-blur-xl"
      >
        <span class="font-serif text-xl font-medium">Odonto Plan</span>
      </div>
    </Panel>

    <Panel position="top-center" class="!top-16 sm:!top-0">
      <div class="flex items-center gap-2" role="group" aria-label="Herramientas">
        <ControlesPane initialViewport={INITIAL_VIEWPORT} />
        <div class="mx-1 h-8 w-px bg-zinc-700/70" aria-hidden="true"></div>
        {#if cargado}
          <SincronizarProgreso />
        {/if}
        <button
          type="button"
          class="boton-herramienta wm-trigger"
          aria-label="Paleta de colores (próximamente)"
          aria-disabled="true"
          title="Paleta de colores (próximamente)"
        >
          <Palette size={28} class="wm wm-hover wm-p-tada" data-wm="palette" />
        </button>
      </div>
    </Panel>

    <Panel position="top-right" class="!top-32 sm:!top-0">
      <MateriaSeleccionada />
    </Panel>
    <Panel position="bottom-center">
      <ProgresoCarrera />
    </Panel>

    <Background />
  </SvelteFlow>
</div>
