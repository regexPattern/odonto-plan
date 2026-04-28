<script lang="ts">
	import type { PlanType } from "$lib/data/plan";
	import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
	import { mode } from "mode-watcher";
	import { toast, Toaster } from "svelte-sonner";
	import plan from "$lib/assets/plan.json";
	import AnioNode from "$lib/components/nodes/AnioNode.svelte";
	import MateriaNode from "$lib/components/nodes/MateriaNode.svelte";
	import CurrMateriaPanel from "$lib/components/panels/CurrMateriaPanel.svelte";
	import { initialGraph, NOTAS_STORAGE_KEY, PADDING_CUATRI_PX, parseNotas } from "$lib/data/plan";
	import { handleNodeClick, handlePaneClick } from "$lib/state.svelte";
	import { browser } from "$app/environment";

	const loadInitialNotas = () => {
		if (!browser) {
			return {};
		}

		const storedNotas = localStorage.getItem(NOTAS_STORAGE_KEY);
		const parsedNotas = parseNotas(storedNotas);

		if (parsedNotas.success) {
			const n = Object.keys(parsedNotas.output).length;
			console.info(`Cargada${n === 1 ? "" : "s"} ${n} nota${n === 1 ? "" : "s"} exitosamente.`);
			return parsedNotas.output;
		} else {
			for (const issue of parsedNotas.issues) {
				console.error(`error cargando notas: ${issue}`);
			}
			return {};
		}
	};

	const initialNotas = loadInitialNotas();
	const [initialNodes, initialEdges] = initialGraph(plan as PlanType, initialNotas);

	let nodes = $state.raw(initialNodes);
	let edges = $state.raw(initialEdges);

	const nodeTypes = {
		materia: MateriaNode,
		anio: AnioNode
	};
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
			<CurrMateriaPanel />
		</Panel>
		<Background />
	</SvelteFlow>

	<Toaster />
</div>
