<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import type { MateriaNodeType } from "$lib/flow/data";
  import { Handle, Position } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();

  const statusClasses: Record<MateriaNodeType["data"]["status"], string> = {
    aprobada:
      "border-solid border-fuchsia-700 bg-fuchsia-300 text-fuchsia-900 dark:bg-fuchsia-500 dark:border-fuchsia-800 dark:text-fuchsia-50",
    desbloqueada:
      "border-solid border-teal-800 bg-teal-500 dark:text-teal-50 text-teal-950 dark:bg-teal-600",
    bloqueada:
      "border-dashed border-[#90a1b9] bg-[#e2e8f0] text-[#62748e] dark:border-[#45556C] dark:bg-[#18181B] dark:text-[#71717B]",
  };
</script>

<Handle type="target" position={Position.Left} />

<div
  class={`relative flex items-center justify-center border-2 px-3 py-2 text-center leading-tight font-medium ${statusClasses[data.status]}`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.nombre}

  {#if typeof data.calificacion === "number"}
    <span
      class="blurred absolute top-0 right-0 z-[2] grid h-7 w-7 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-fuchsia-700 text-xs leading-none font-bold dark:border-fuchsia-400"
    >
      {data.calificacion}
    </span>
  {/if}
</div>

<Handle type="source" position={Position.Right} />
