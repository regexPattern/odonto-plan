<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import type { MateriaNodeType } from "#lib/graph/index.js";
  import { PLAN } from "#lib/plan/index.js";
  import { Handle, Position } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();

  const tieneCorrelativas = $derived(Boolean(PLAN.correlatividades[data.codigo]?.length));
  const tieneDependientes = $derived(
    Object.values(PLAN.correlatividades).some((correlativas) => correlativas.includes(data.codigo)),
  );
</script>

{#if tieneCorrelativas}
  <Handle type="target" position={Position.Left} class="z-10" />
{/if}

<div
  class={`relative flex items-center justify-center border-2 px-3 py-2 text-center leading-tight font-medium ${data.estado} aprobada:border-solid aprobada:border-border-aprobada aprobada:bg-bg-aprobada aprobada:text-fg-aprobada desbloqueada:border-solid desbloqueada:border-border-desbloqueada desbloqueada:bg-bg-desbloqueada desbloqueada:text-fg-desbloqueada bloqueada:border-dashed bloqueada:border-border-bloqueada bloqueada:bg-bg-bloqueada bloqueada:text-fg-bloqueada`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.nombre}

  {#if data.estado === "aprobada" && data.calificacion !== null}
    <span
      class="absolute -top-3.5 -right-3.5 flex size-7 items-center justify-center rounded-full border-2 border-border-aprobada bg-transparent text-sm leading-none font-bold text-fg-aprobada backdrop-blur-xl"
    >
      {data.calificacion}
    </span>
  {/if}
</div>

{#if tieneDependientes}
  <Handle type="source" position={Position.Right} class="z-10" />
{/if}
