<script lang="ts">
  import type { AnioNodeType } from "$lib/flow";
  import type { NodeProps } from "@xyflow/svelte";

  let { data }: NodeProps<AnioNodeType> = $props();
</script>

<div
  class="flex items-center justify-center bg-gray-300 px-3 py-2 text-center leading-tight font-semibold"
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.desc}
</div>
