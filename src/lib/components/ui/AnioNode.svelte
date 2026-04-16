<script lang="ts">
	import type { AnioNodeType } from "$lib/plan";
	import { type NodeProps } from "@xyflow/svelte";

	let { data }: NodeProps<AnioNodeType> = $props();
</script>

<div class="text-2xl h-full justify-center flex items-center">
	{data.descripcion}
</div>
