<script lang="ts">
  import { Background, SvelteFlow, type NodeTypes } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import NodoAnio from "./NodoAnio.svelte";
  import NodoMateria from "./NodoMateria.svelte";
  import { nodos, vertices } from "$lib/nodos-vertices";

  export const nodeTypes: NodeTypes = {
    materia: NodoMateria as NodeTypes[string],
    anio: NodoAnio as NodeTypes[string],
  };

  let nodes = $state.raw(nodos);
  let edges = $state.raw(vertices);
</script>

<div style:width="100vw" style:height="100vh">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    fitView
    edgesFocusable={false}
    elevateEdgesOnSelect={false}
    onnodeclick={() => {}}
  >
    <Background />
  </SvelteFlow>
</div>
