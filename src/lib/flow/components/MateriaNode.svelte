<script lang="ts">
  import type { MateriaNodeType } from "$lib/flow/data";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data }: NodeProps<MateriaNodeType> = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class={`border-2 px-3 py-2 leading-tight ${data.status} flex items-center justify-center text-center font-medium`}
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  {data.nombre}
</div>

<Handle type="source" position={Position.Right} />

<style>
  .aprobada {
    background-color: #00BC7D;
    color: #004F3B;
    border-style: solid;
    border-color: #006045;
  }

  .desbloqueada {
    background: #53eafd;
    color: #005F78;
    border-style: solid;
    border-color: #007595;
  }

  .bloqueada {
    background: #E2E8F0;
    color: #62748E;
    border-style: dashed;
    border-color: #90A1B9;
  }
</style>
