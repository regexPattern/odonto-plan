<script lang="ts">
  import { Handle, Position, type Node, type NodeProps } from "@xyflow/svelte";
  import { type NodoMateriaType } from "$lib/nodos-vertices";

  type NodoMateriaFlow = Node<NodoMateriaType, "materia">;
  let { data }: NodeProps<NodoMateriaFlow> = $props();
</script>

<Handle type="target" position={Position.Left} />
<div
  class="bg-gray-200 px-3 py-2 w-full h-full flex justify-center items-center text-center leading-tight"
>
  {data.materia.nombre}
</div>
<Handle type="source" position={Position.Right} />
