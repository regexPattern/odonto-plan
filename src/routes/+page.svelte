<script lang="ts">
  import "@xyflow/svelte/dist/style.css";
  import CloudUpload from "@withicons/svelte/kawaii/icons/cloud-upload";
  import { Background, Panel, SvelteFlow } from "@xyflow/svelte";
  import { mode } from "mode-watcher";
  import { onMount, tick } from "svelte";
  import logo from "#lib/assets/favicon.svg";
  import AyudaPopover from "#lib/components/AyudaPopover.svelte";
  import ControlesPane from "#lib/components/ControlesPane.svelte";
  import EnlacesSociales from "#lib/components/EnlacesSociales.svelte";
  import IntroduccionPlan from "#lib/components/IntroduccionPlan.svelte";
  import MateriaSeleccionada from "#lib/components/MateriaSeleccionada.svelte";
  import ProgresoCarrera from "#lib/components/ProgresoCarrera.svelte";
  import SelectorPaleta from "#lib/components/SelectorPaleta.svelte";
  import SincronizarProgreso from "#lib/components/SincronizarProgreso.svelte";
  import { nodeTypes } from "#lib/graph/index.js";
  import { MAX_ZOOM, MIN_ZOOM } from "#lib/graph/layout.js";
  import graph from "#lib/graph/state.svelte.js";
  import { cargarMateriasAprobadas } from "#lib/graph/storage.js";
  import { cargarViewport, guardarViewport, VISTA_CBC } from "#lib/graph/viewport.js";

  const TITLE = "OdontoPlan";
  const DESCRIPTION =
    "Seguí tu progreso, marcá tus materias aprobadas y mirá cuánto te falta para recibirte de odontólogo u odontóloga en la Facultad de Odontología de la Universidad de Buenos Aires (FOUBA).";
  const CANONICAL_URL = "https://odonto-plan.regexpattern.dev/";
  let viewport = $state({ ...VISTA_CBC });

  // Montar la sincronización y la barra recién cuando el progreso local ya está cargado.
  let cargado = $state(false);

  onMount(async () => {
    viewport = cargarViewport();
    const materiasAprobadas = cargarMateriasAprobadas();
    if (materiasAprobadas !== null) graph.materiasAprobadas = materiasAprobadas;
    cargado = true;
    await tick();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    delete document.documentElement.dataset.progresoPendiente;
  });

  async function vistaInicializada() {
    await tick();
    delete document.documentElement.dataset.vistaPendiente;
  }
</script>

<svelte:head>
  <title>{TITLE}</title>
  <link rel="canonical" href={CANONICAL_URL} />
  <meta name="description" content={DESCRIPTION} />
  <meta name="author" content="Odonto Plan" />
  <meta name="application-name" content="Odonto Plan" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_AR" />
  <meta property="og:site_name" content="Odonto Plan" />
  <meta property="og:title" content={TITLE} />
  <meta property="og:url" content={CANONICAL_URL} />
  <meta property="og:description" content={DESCRIPTION} />
  <!-- Reemplazar static/opengraph.png por la imagen final (1200 × 630 px). -->
  <meta property="og:image" content="https://odonto-plan.regexpattern.dev/opengraph.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Odonto Plan" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content="https://odonto-plan.regexpattern.dev/opengraph.png" />
  <meta name="twitter:image:alt" content="Odonto Plan" />
</svelte:head>

<main>
  <div id="grafo" class="h-dvh w-full" aria-label="Grafo interactivo de materias">
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
      initialViewport={VISTA_CBC}
      bind:viewport
      oninit={vistaInicializada}
      onmoveend={(_, vista) => guardarViewport(vista)}
      zoomOnDoubleClick={false}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
    >
      <!-- Una sola capa para maquetar todo con Tailwind: en mobile la ficha de la materia
         va como panel inferior sobre el progreso; desde lg vuelve a las esquinas. -->
      <Panel position="top-left" class="pointer-events-none! inset-0! m-0!">
        <a
          href="#sobre"
          aria-label="OdontoPlan: información y plan de estudios"
          class="pointer-events-auto absolute top-2 left-2 flex h-10 items-center gap-2 bg-panel/60 px-2 backdrop-blur-sm sm:h-11 lg:top-4 lg:left-4"
        >
          <img src={logo} alt="" class="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
          <span class="text-lg font-medium tracking-tight max-[390px]:sr-only sm:text-xl"
            >OdontoPlan</span
          >
        </a>

        <div class="pointer-events-auto absolute top-2 right-2 lg:top-4 lg:right-4">
          <AyudaPopover />
        </div>

        <div
          class="pointer-events-auto absolute top-2 right-14 flex items-center gap-1.5 sm:right-16 sm:gap-2 lg:top-4 lg:right-auto lg:left-1/2 lg:-translate-x-1/2"
          role="group"
          aria-label="Herramientas"
        >
          <ControlesPane />
          <div class="mx-1 hidden h-8 w-px bg-borde sm:block" aria-hidden="true"></div>
          {#if cargado}
            <SincronizarProgreso />
          {:else}
            <!-- Reserva el lugar del botón (mismo tamaño) para que no salte al montarse. -->
            <button class="boton-herramienta" disabled aria-hidden="true" tabindex="-1">
              <span class="flex shrink-0"><CloudUpload size={24} /></span>
            </button>
          {/if}
          <SelectorPaleta />
          <div class="mx-1 hidden h-8 w-px bg-borde sm:block" aria-hidden="true"></div>
          <EnlacesSociales />
        </div>

        <!-- Ficha y progreso se apilan a la izquierda, con ancho acotado desde sm;
           desde lg cada uno se ancla a su esquina. -->
        <div
          class="pointer-events-none absolute inset-x-2 bottom-2 flex flex-col items-start gap-2 lg:contents"
        >
          <div
            data-panel-materia
            class="pointer-events-auto w-full sm:w-72 lg:absolute lg:inset-x-auto lg:top-20 lg:right-4 lg:w-auto"
          >
            <MateriaSeleccionada />
          </div>

          <div class="pointer-events-auto w-full sm:w-auto lg:absolute lg:bottom-4 lg:left-4">
            <ProgresoCarrera cargando={!cargado} />
          </div>
        </div>
      </Panel>

      <Background />
    </SvelteFlow>
  </div>
  <IntroduccionPlan />
</main>
