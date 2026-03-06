<script lang="ts">
  import type { MateriaNodeType } from "$lib/flow/data";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class={`materia-node border-2 px-3 py-2 leading-tight ${data.status} flex items-center justify-center text-center font-medium`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.nombre}

  {#if typeof data.calificacion === "number"}
    <span class="calificacion-badge">{data.calificacion}</span>
  {/if}
</div>

<Handle type="source" position={Position.Right} />

<style>
  .materia-node {
    position: relative;
  }

  .calificacion-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    display: grid;
    place-items: center;
    width: 28px;
    aspect-ratio: 1 / 1;
    border-radius: 999px;
    border: 2px solid #004f3b;
    background-color: #00d492;
    color: #004f3b;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    z-index: 2;
  }

  .aprobada {
    background-color: #00d492;
    color: #004f3b;
    border-style: solid;
    border-color: #006045;
  }

  .desbloqueada {
    background: #53eafd;
    color: #005f78;
    border-style: solid;
    border-color: #007595;
  }

  .bloqueada {
    background: #e2e8f0;
    color: #62748e;
    border-style: dashed;
    border-color: #90a1b9;
  }
</style>
