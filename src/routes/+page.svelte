<script lang="ts">
  import "@xyflow/svelte/dist/style.css";
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import { mode } from "mode-watcher";
  import { onMount } from "svelte";
  import { nodeTypes } from "#lib/graph/index.js";
  import { MAX_ZOOM, MIN_ZOOM } from "#lib/graph/layout.js";
  import graph from "#lib/graph/state.svelte.js";
  import { cargarMateriasAprobadas } from "#lib/graph/storage.js";
  import ControlesPane from "./ControlesPane.svelte";
  import EnlacesSociales from "./EnlacesSociales.svelte";
  import MateriaSeleccionada from "./MateriaSeleccionada.svelte";
  import ProgresoCarrera from "./ProgresoCarrera.svelte";
  import SelectorPaleta from "./SelectorPaleta.svelte";
  import SincronizarProgreso from "./SincronizarProgreso.svelte";

  const INITIAL_VIEWPORT = { x: 0, y: 140, zoom: 1 };

  // Montar la sincronización y la barra recién cuando el progreso local ya está cargado.
  let cargado = $state(false);

  onMount(() => {
    const materiasAprobadas = cargarMateriasAprobadas();
    if (materiasAprobadas !== null) graph.materiasAprobadas = materiasAprobadas;
    cargado = true;
  });
</script>

<svelte:head>
  <title>Odonto Plan</title>
</svelte:head>

<div class="h-dvh w-full">
  <SvelteFlow
    bind:nodes={graph.nodes}
    bind:edges={graph.edges}
    {nodeTypes}
    nodesFocusable={false}
    nodesDraggable={false}
    edgesFocusable={false}
    defaultEdgeOptions={{ selectable: false }}
    onnodeclick={(e) => {
      if (e.node.type === "materia") {
        graph.seleccionarMateria(e.node.data);
      } else {
        graph.deseleccionarMateria();
      }
    }}
    onpaneclick={() => graph.deseleccionarMateria()}
    colorMode={mode.current ?? "dark"}
    initialViewport={INITIAL_VIEWPORT}
    minZoom={MIN_ZOOM}
    maxZoom={MAX_ZOOM}
  >
    <!-- Una sola capa para maquetar todo con Tailwind: en mobile la ficha de la materia
         va como panel inferior sobre el progreso; desde lg vuelve a las esquinas. -->
    <Panel position="top-left" class="pointer-events-none! inset-0! m-0!">
      <div
        class="pointer-events-auto absolute top-2 left-2 superficie p-1.5 sm:p-2 lg:top-4 lg:left-4"
      >
        <span class="font-serif text-lg font-medium sm:text-xl">Odonto Plan</span>
      </div>

      <div
        class="pointer-events-auto absolute top-2 right-2 flex items-center gap-1.5 sm:gap-2 lg:top-4 lg:right-auto lg:left-1/2 lg:-translate-x-1/2"
        role="group"
        aria-label="Herramientas"
      >
        <ControlesPane listo={cargado} />
        <div class="mx-1 hidden h-8 w-px bg-borde sm:block" aria-hidden="true"></div>
        {#if cargado}
          <SincronizarProgreso />
        {/if}
        <SelectorPaleta />
        <div class="mx-1 hidden h-8 w-px bg-borde sm:block" aria-hidden="true"></div>
        <EnlacesSociales />
      </div>

      <!-- En mobile ficha y progreso se apilan; desde lg cada uno se ancla a su esquina. -->
      <div
        class="pointer-events-none absolute inset-x-2 bottom-2 flex flex-col items-start gap-2 lg:contents"
      >
        <div
          class="pointer-events-auto w-full lg:absolute lg:inset-x-auto lg:top-4 lg:right-4 lg:w-auto"
        >
          <MateriaSeleccionada />
        </div>

        <div class="pointer-events-auto lg:absolute lg:bottom-4 lg:left-4">
          {#if cargado}
            <ProgresoCarrera />
          {/if}
        </div>
      </div>
    </Panel>

    <Background />
  </SvelteFlow>
</div>
