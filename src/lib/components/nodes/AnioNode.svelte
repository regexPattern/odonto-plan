<script lang="ts">
	import type { AnioNodeType } from "$lib/data/plan";
	import { type NodeProps } from "@xyflow/svelte";

	let { data }: NodeProps<AnioNodeType> = $props();
</script>

<div class="flex h-full items-center justify-center text-2xl">
	{data.descripcion}
</div>
