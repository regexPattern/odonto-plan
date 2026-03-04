<script lang="ts">
  import { type Node, type NodeProps } from "@xyflow/svelte";
  import { HEIGHT_NODO_ANIO_PX, type NodoAnioType } from "$lib/nodos-vertices";

  type NodoAnioFlow = Node<NodoAnioType, "anio">;
  let { data }: NodeProps<NodoAnioFlow> = $props();
</script>

<div
  class="bg-gray-300 px-3 py-2 w-full h-full flex justify-center items-center text-center leading-tight font-semibold"
  style:height={`${HEIGHT_NODO_ANIO_PX}px`}
>
  {data.descripcion}
</div>
