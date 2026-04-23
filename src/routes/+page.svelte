<script lang="ts">
	import type { Plan } from "$lib/plan";
	import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
	import { mode } from "mode-watcher";
	import plan from "$lib/assets/plan.json";
	import AnioNode from "$lib/components/nodes/AnioNode.svelte";
	import MateriaNode from "$lib/components/nodes/MateriaNode.svelte";
	import CurrMateria from "$lib/components/panels/CurrMateria.svelte";
	import { initialGraph, PADDING_CUATRI_PX } from "$lib/plan";
	import { handleNodeClick, handlePaneClick } from "$lib/state/flow.svelte";

	const [initialNodes, initialEdges] = initialGraph(plan as Plan);

	let nodes = $state.raw(initialNodes);
	let edges = $state.raw(initialEdges);

	const nodeTypes = { materia: MateriaNode, anio: AnioNode };
</script>

<div style:width="100vw" style:height="100vh">
	<SvelteFlow
		bind:nodes
		bind:edges
		{nodeTypes}
		colorMode={mode.current}
		nodesDraggable={false}
		edgesFocusable={false}
		initialViewport={{ x: 0, y: PADDING_CUATRI_PX, zoom: 0.7 }}
		onnodeclick={handleNodeClick}
		onpaneclick={handlePaneClick}
	>
		<Panel position="top-right">
			<CurrMateria />
		</Panel>
		<Background />
	</SvelteFlow>
</div>
