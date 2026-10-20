<script lang="ts">
  import "@xyflow/svelte/dist/style.css";
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import { mode } from "mode-watcher";
  import { onMount } from "svelte";
  import { nodeTypes } from "#lib/graph/index.js";
  import { MAX_ZOOM, MIN_ZOOM } from "#lib/graph/layout.js";
  import graph from "#lib/graph/state.svelte.js";
  import logo from "#lib/assets/favicon.svg";
  import { cargarMateriasAprobadas } from "#lib/graph/storage.js";
  import AyudaPopover from "#lib/components/AyudaPopover.svelte";
  import ControlesPane from "#lib/components/ControlesPane.svelte";
  import EnlacesSociales from "#lib/components/EnlacesSociales.svelte";
  import MateriaSeleccionada from "#lib/components/MateriaSeleccionada.svelte";
  import ProgresoCarrera from "#lib/components/ProgresoCarrera.svelte";
  import SelectorPaleta from "#lib/components/SelectorPaleta.svelte";
  import SincronizarProgreso from "#lib/components/SincronizarProgreso.svelte";

  const DESCRIPTION =
    "Seguí tu progreso en la carrera y mirá qué tan cerca estás de ser odontólogo u odontóloga.";
  const INITIAL_VIEWPORT = { x: 0, y: 100, zoom: 1 };

  // Montar la sincronización y la barra recién cuando el progreso local ya está cargado.
  let cargado = $state(false);

  onMount(() => {
    const materiasAprobadas = cargarMateriasAprobadas();
    if (materiasAprobadas !== null) graph.materiasAprobadas = materiasAprobadas;
    cargado = true;
  });
</script>

<svelte:head>
  <title>OdontoPlan</title>
  <meta name="description" content={DESCRIPTION} />
  <meta name="author" content="Odonto Plan" />
  <meta name="application-name" content="Odonto Plan" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_AR" />
  <meta property="og:site_name" content="Odonto Plan" />
  <meta property="og:title" content="Odonto Plan" />
  <meta property="og:description" content={DESCRIPTION} />
  <!-- Reemplazar static/opengraph.png por la imagen final (1200 × 630 px). -->
  <meta property="og:image" content="/opengraph.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Odonto Plan" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Odonto Plan" />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content="/opengraph.png" />
  <meta name="twitter:image:alt" content="Odonto Plan" />
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
    colorMode={mode.current ?? "light"}
    initialViewport={INITIAL_VIEWPORT}
    minZoom={MIN_ZOOM}
    maxZoom={MAX_ZOOM}
  >
    <!-- Una sola capa para maquetar todo con Tailwind: en mobile la ficha de la materia
         va como panel inferior sobre el progreso; desde lg vuelve a las esquinas. -->
    <Panel position="top-left" class="pointer-events-none! inset-0! m-0!">
      <div
        class="pointer-events-auto absolute top-2 left-2 flex h-10 items-center gap-2 bg-panel/60 px-2 backdrop-blur-sm sm:h-11 lg:top-4 lg:left-4"
      >
        <img src={logo} alt="" class="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        <span class="text-lg font-medium tracking-tight sm:text-xl">OdontoPlan</span>
      </div>

      <div class="pointer-events-auto absolute top-2 right-2 lg:top-4 lg:right-4">
        <AyudaPopover />
      </div>

      <div
        class="pointer-events-auto absolute top-2 right-14 flex items-center gap-1.5 sm:right-16 sm:gap-2 lg:top-4 lg:right-auto lg:left-1/2 lg:-translate-x-1/2"
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
          data-panel-materia
          class="pointer-events-auto w-full lg:absolute lg:inset-x-auto lg:top-20 lg:right-4 lg:w-auto"
        >
          <MateriaSeleccionada />
        </div>

        <div class="pointer-events-auto w-full sm:w-auto lg:absolute lg:bottom-4 lg:left-4">
          {#if cargado}
            <ProgresoCarrera />
          {/if}
        </div>
      </div>
    </Panel>

    <Background />
  </SvelteFlow>
</div>
