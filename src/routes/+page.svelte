<script lang="ts">
	import plan from "$lib/assets/plan.json";
	import { initialGraph, type Plan } from "$lib/plan";
	import { Background, SvelteFlow } from "@xyflow/svelte";
	import { mode } from "mode-watcher";
	import MateriaNode from "$lib/components/ui/MateriaNode.svelte";
	import AnioNode from "$lib/components/ui/AnioNode.svelte";

	const [initialNodes, initialEdges] = initialGraph(plan as Plan);

	let nodes = $state.raw(initialNodes);
	let edges = $state.raw(initialEdges);

	const nodeTypes = { materia: MateriaNode, anio: AnioNode };
</script>

<div style:width="100vw" style:height="100vh">
	<SvelteFlow bind:nodes bind:edges {nodeTypes} colorMode={mode.current} fitView>
		<Background />
	</SvelteFlow>
</div>
