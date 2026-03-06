<script lang="ts">
  import { Background, SvelteFlow, type NodeTypes } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import AnioNode from "$lib/nodes/AnioNode.svelte";
  import MateriaNode from "$lib/nodes/MateriaNode.svelte";
  import { nodes as initialNodes, edges as initialEdges } from "$lib/flow";

  const nodeTypes: NodeTypes = {
    anio: AnioNode,
    materia: MateriaNode,
  };

  let nodes = initialNodes;
  let edges = initialEdges;
</script>

<div style:width="100vw" style:height="100vh">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} fitView edgesFocusable={false}>
    <Background />
  </SvelteFlow>
</div>
