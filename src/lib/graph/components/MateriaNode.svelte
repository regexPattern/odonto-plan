<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import type { MateriaNodeType } from "#lib/graph/index.js";
  import { Handle, Position } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();

  const estado: Record<MateriaNodeType["data"]["estado"], string> = {
    aprobada:
      "border-solid border-fuchsia-700 bg-fuchsia-300 text-fuchsia-900 dark:border-fuchsia-800 dark:bg-fuchsia-500 dark:text-fuchsia-50",
    desbloqueada:
      "border-solid border-teal-800 bg-teal-500 text-teal-950 dark:bg-teal-600 dark:text-teal-50",
    bloqueada:
      "border-dashed border-[#90a1b9] bg-[#e2e8f0] text-[#62748e] dark:border-[#45556C] dark:bg-[#18181B] dark:text-[#71717B]",
  };
</script>

<Handle type="target" position={Position.Left} />
<div
  class={`relative flex items-center justify-center border-2 px-3 py-2 text-center leading-tight font-medium ${estado[data.estado]}`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.nombre}
</div>
<Handle type="source" position={Position.Right} />
