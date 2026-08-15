<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import type { AnioNodeType } from "#lib/graph/index.js";

  let { data }: NodeProps<AnioNodeType> = $props();
</script>

<div
  class="flex items-center justify-center text-center text-2xl leading-tight font-semibold"
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.descripcion}
</div>
