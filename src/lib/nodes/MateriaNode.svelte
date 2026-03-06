<script lang="ts">
  import type { MateriaNodeType } from "$lib/flow";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class="rounded border border-gray-300 bg-white px-3 py-2 text-sm leading-tight shadow-sm"
  style:width={`${data.width}px`}
>
  <div class="font-semibold">{data.nombre}</div>
  <div class="text-xs text-gray-500">{data.codigo}</div>
</div>

<Handle type="source" position={Position.Right} />
