<script lang="ts">
	import type { MateriaNodeType } from "$lib/plan";
	import { Handle, Position, type NodeProps } from "@xyflow/svelte";

	let { data }: NodeProps<MateriaNodeType> = $props();
</script>

<div class="h-full border-2 border-blue-700 bg-blue-500 text-center">
	{#if data.tiene_correlativas}
		<Handle type="target" position={Position.Left} />
	{/if}
	{data.nombre}
	{#if data.es_correlativa}
		<Handle type="source" position={Position.Right} />
	{/if}
</div>
