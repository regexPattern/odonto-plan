<script lang="ts">
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { onMount } from "svelte";
  import { nodeTypes } from "#lib/graph/index.js";
  import graph from "#lib/graph/state.svelte.js";
  import { cargarMateriasAprobadas } from "#lib/graph/storage.js";
  import MateriaSeleccionada from "./MateriaSeleccionada.svelte";
  import ProgresoCarrera from "./ProgresoCarrera.svelte";
  import SincronizarProgreso from "./SincronizarProgreso.svelte";

  const INITIAL_VIEWPORT = { x: 0, y: 140, zoom: 0.75 };

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
    defaultEdgeOptions={{
      selectable: false,
    }}
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
        class="flex items-center gap-3 border border-zinc-800 bg-[#141414]/50 p-2 backdrop-blur-xl"
      >
        <span class="font-serif">Odonto Plan</span>
        {#if cargado}<SincronizarProgreso />{/if}
      </div>
    </Panel>

    <Panel position="top-right" class="!top-16 sm:!top-0"><MateriaSeleccionada /></Panel>
    <Panel position="bottom-center"><ProgresoCarrera /></Panel>

    <Background />
  </SvelteFlow>
</div>
