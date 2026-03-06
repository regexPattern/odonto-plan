<script lang="ts">
  import {
    Background,
    SvelteFlow,
    type Edge,
    type NodeTypes,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import AnioNode from "$lib/nodes/AnioNode.svelte";
  import MateriaNode from "$lib/nodes/MateriaNode.svelte";
  import { edges as initialEdges, nodes as initialNodes } from "$lib/flow";

  const nodeTypes: NodeTypes = {
    anio: AnioNode,
    materia: MateriaNode,
  };

  const DEFAULT_EDGE_STYLE = "stroke: #94a3b8; stroke-width: 1.5;";
  const HIGHLIGHT_EDGE_STYLE = "stroke: #0ea5e9; stroke-width: 3;";

  let nodes = $state(initialNodes);
  let edges = $state<Edge[]>(
    initialEdges.map((edge) => ({ ...edge, style: DEFAULT_EDGE_STYLE })),
  );
  let selectedMateriaId = $state<string | null>(null);

  const clearHighlight = () => {
    selectedMateriaId = null;

    nodes = nodes.map((node) => {
      if (node.type !== "materia") {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          highlight: null,
        },
      };
    });

    edges = edges.map((edge) => ({ ...edge, style: DEFAULT_EDGE_STYLE }));
  };

  const highlightMateria = (materiaId: string) => {
    if (selectedMateriaId === materiaId) {
      clearHighlight();
      return;
    }

    selectedMateriaId = materiaId;

    const dependientes = new Set(
      edges
        .filter((edge) => edge.target === materiaId)
        .map((edge) => edge.source),
    );
    const correlativas = new Set(
      edges
        .filter((edge) => edge.source === materiaId)
        .map((edge) => edge.target),
    );

    nodes = nodes.map((node) => {
      if (node.type !== "materia") {
        return node;
      }

      let highlight: "selected" | "dependiente" | "correlativa" | null;
      if (node.id === materiaId) {
        highlight = "selected";
      } else if (dependientes.has(node.id)) {
        highlight = "dependiente";
      } else if (correlativas.has(node.id)) {
        highlight = "correlativa";
      } else {
        highlight = null;
      }

      return {
        ...node,
        data: {
          ...node.data,
          highlight,
        },
      };
    });

    edges = edges.map((edge) => ({
      ...edge,
      style:
        edge.source === materiaId || edge.target === materiaId
          ? HIGHLIGHT_EDGE_STYLE
          : DEFAULT_EDGE_STYLE,
    }));
  };

  const handleNodeClick = ({ node }: { node: (typeof nodes)[number] }) => {
    if (node.type !== "materia") {
      return;
    }

    highlightMateria(node.id);
  };
</script>

<div style:width="100vw" style:height="100vh">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    fitView
    edgesFocusable={false}
    onnodeclick={handleNodeClick}
    onpaneclick={clearHighlight}
  >
    <Background />
  </SvelteFlow>
</div>
