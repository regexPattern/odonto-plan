<script lang="ts">
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import graph, { nodeTypes } from "#lib/graph/state.svelte.js";
  import MateriaSeleccionada from "./MateriaSeleccionada.svelte";
  import ProgresoCarrera from "./ProgresoCarrera.svelte";

  const INITIAL_VIEWPORT = { x: 0, y: 140, zoom: 0.75 };
</script>

<div class="h-[calc(100dvh-4rem)] w-full">
  <SvelteFlow
    bind:nodes={graph.nodes}
    bind:edges={graph.edges}
    {nodeTypes}
    nodesFocusable={false}
    nodesDraggable={false}
    edgesFocusable={false}
    onnodeclick={(e) => {
      if (e.node.type === "materia") {
        graph.seleccionarMateria(e.node.data);
      } else {
        graph.deseleccionarMateria();
      }
    }}
    onpaneclick={graph.deseleccionarMateria}
    colorMode="dark"
    initialViewport={INITIAL_VIEWPORT}
    minZoom={0.4}
    maxZoom={1}
  >
    <Panel position="top-right"><MateriaSeleccionada /></Panel>
    <Panel position="top-left"><ProgresoCarrera /></Panel>

    <Background />
  </SvelteFlow>
</div>
