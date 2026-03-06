<script lang="ts">
  import type { MateriaNodeType } from "$lib/flow";
  import { Handle, Position } from "@xyflow/svelte";

  let { data } = $props<{ data: MateriaNodeType["data"] }>();

  const highlightClass = $derived.by(() => {
    switch (data.highlight) {
      case "selected":
        return "border-sky-600 bg-sky-100";
      case "dependiente":
        return "border-emerald-600 bg-emerald-100";
      case "correlativa":
        return "border-amber-500 bg-amber-100";
      default:
        return "border-gray-300 bg-white";
    }
  });
</script>

<Handle type="target" position={Position.Left} />

<div
  class={`border px-3 py-2 text-sm leading-tight ${highlightClass}`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  <div class="font-semibold">{data.nombre}</div>
  <div class="text-xs text-gray-500">{data.codigo}</div>
</div>

<Handle type="source" position={Position.Right} />
