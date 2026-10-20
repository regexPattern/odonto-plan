<script lang="ts">
  import { useSvelteFlow, type NodeProps } from "@xyflow/svelte";
  import type { AnioNodeType } from "#lib/graph/index.js";
  import { ANIMACION_VISTA, vistaParaAnio } from "#lib/graph/layout.js";

  let { data }: NodeProps<AnioNodeType> = $props();
  const { setViewport } = useSvelteFlow();

  function centrarAnio() {
    setViewport(vistaParaAnio(data.indice, window.innerWidth), ANIMACION_VISTA);
  }
</script>

<div
  class="pointer-events-none flex items-center justify-center text-center text-3xl leading-tight font-semibold"
  style:width={`${data.width}px`}
  style:height={`${data.height}px`}
>
  <button
    type="button"
    class="nodrag nopan pointer-events-auto cursor-pointer px-8 py-1"
    title="Clic para centrar este año"
    onclick={(event) => {
      event.stopPropagation();
      centrarAnio();
    }}
    onkeydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        centrarAnio();
      }
    }}
  >
    {data.descripcion}
  </button>
</div>
