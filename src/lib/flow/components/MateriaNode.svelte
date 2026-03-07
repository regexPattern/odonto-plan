<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import type { MateriaNodeType } from "$lib/flow/data";
  import { Handle, Position } from "@xyflow/svelte";
  import { cn } from "$lib/utils/cn";

  let { data }: NodeProps<MateriaNodeType> = $props();

  const statusClasses: Record<MateriaNodeType["data"]["status"], string> = {
    aprobada: cn(
      "border-solid border-materia-aprobada-border bg-materia-aprobada-bg text-materia-aprobada-fg",
    ),
    desbloqueada: cn(
      "border-solid border-materia-desbloqueada-border bg-materia-desbloqueada-bg text-materia-desbloqueada-fg",
    ),
    bloqueada: cn(
      "border-dashed border-materia-bloqueada-border bg-materia-bloqueada-bg text-materia-bloqueada-fg",
    ),
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
      class="blurred absolute top-0 right-0 z-2 grid h-7 w-7 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-materia-calificacion-border text-xs leading-none font-bold"
    >
      {data.calificacion}
    </span>
  {/if}
</div>

<Handle type="source" position={Position.Right} />
