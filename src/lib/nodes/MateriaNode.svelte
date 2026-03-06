<script lang="ts">
  import type { MateriaNodeType } from "$lib/flow";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class="border border-gray-300 bg-white px-3 py-2 text-sm leading-tight"
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  <div class="font-semibold">{data.nombre}</div>
  <div class="text-xs text-gray-500">{data.codigo}</div>
</div>

<Handle type="source" position={Position.Right} />
