<script lang="ts">
	import type { NodeProps } from "@xyflow/svelte";
	import type { MateriaNodeType } from "$lib/plan";
	import { Handle, Position } from "@xyflow/svelte";

	let { data }: NodeProps<MateriaNodeType> = $props();
</script>

{#if data.tiene_correlativas}
	<Handle type="target" position={Position.Left} />
{/if}

<div
	class="flex h-full w-full items-center justify-center border-2 border-blue-700 bg-blue-500 p-4 text-center"
>
	{data.nombre}
</div>

{#if data.es_correlativa}
	<Handle type="source" position={Position.Right} />
{/if}
