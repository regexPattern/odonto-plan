<script lang="ts">
  import { browser } from "$app/env";
  import { AYUDA_VISTA_STORAGE_KEY } from "$app/env/public";
  import X from "@withicons/svelte/kawaii/icons/close";
  import CloudUpload from "@withicons/svelte/kawaii/icons/cloud-upload";
  import HelpCircle from "@withicons/svelte/kawaii/icons/help-circle";
  import MousePointerClick from "@withicons/svelte/kawaii/icons/mouse-pointer-click";
  import Percent from "@withicons/svelte/kawaii/icons/percent";
  import { Popover } from "bits-ui";
  import { onMount } from "svelte";
  import { track } from "#lib/analytics.js";
  import { animar } from "#lib/animar.js";
  import graph from "#lib/graph/state.svelte.js";
  import { guardarPersistido, leerPersistido } from "#lib/storage.js";

  // Primera visita (o siempre en dev): el popup se abre solo.
  let abierto = $state(false);

  // Ayuda y ficha de materia se excluyen: abrir una cierra la otra.
  $effect(() => {
    if (graph.materiaSeleccionada) abierto = false;
  });

  const alCambiar = (open: boolean) => {
    if (open) graph.deseleccionarMateria();
  };

  const opciones = [
    {
      id: "materia",
      icono: MousePointerClick,
      selector: ".svelte-flow__node-materia",
      texto: "Hacé clic en una materia para ver sus detalles o afuera para volver.",
    },
    {
      id: "progreso",
      icono: Percent,
      evento: "ayuda-progreso",
      texto:
        "Poné el mouse o el dedo sobre la barra de progreso para ver cuántas materias aprobaste.",
    },
    {
      id: "sincronizar",
      icono: CloudUpload,
      evento: "ayuda-sincronizar",
      texto: "El botón de sincronización te permite pasar tu progreso a otro dispositivo.",
    },
  ];

  // Cierra la ayuda y hace latir el elemento al que se refiere la opción (o dispara su evento).
  const resaltar = ({ selector, evento }: { selector?: string; evento?: string }) => {
    abierto = false;
    // Solo una animación a la vez: corta cualquier otra en curso.
    for (const el of document.querySelectorAll(".ayuda-destacada")) {
      el.classList.remove("ayuda-destacada");
    }
    if (evento) window.dispatchEvent(new CustomEvent(evento));
    if (!selector) return;
    for (const el of document.querySelectorAll<HTMLElement>(selector)) {
      void el.offsetWidth; // reinicia la animación
      el.classList.add("ayuda-destacada");
      el.addEventListener("animationend", () => el.classList.remove("ayuda-destacada"), {
        once: true,
      });
    }
  };

  // Con varios menús abiertos, un clic en el canvas cierra la ayuda también (no solo el último).
  $effect(() => {
    if (!abierto) return;
    const alPresionar = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest(".svelte-flow") && !el.closest(".svelte-flow__panel")) abierto = false;
    };
    window.addEventListener("pointerdown", alPresionar, true);
    return () => window.removeEventListener("pointerdown", alPresionar, true);
  });

  onMount(() => {
    if (!browser) return;
    if (import.meta.env.DEV) {
      abierto = true;
      return;
    }
    try {
      if (leerPersistido(AYUDA_VISTA_STORAGE_KEY) === null) {
        guardarPersistido(AYUDA_VISTA_STORAGE_KEY, "1");
        abierto = true;
      }
    } catch {
      // Sin acceso a localStorage: queda solo el botón.
    }
  });
</script>

<Popover.Root bind:open={abierto} onOpenChange={alCambiar}>
  <Popover.Trigger class="boton-herramienta wm-trigger" aria-label="Ayuda" title="Ayuda">
    <span class="flex shrink-0" use:animar={{ nombre: "help-circle" }}>
      <HelpCircle size={24} />
    </span>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      side="bottom"
      align="end"
      sideOffset={8}
      collisionPadding={8}
      aria-labelledby="ayuda-titulo"
      class="relative z-50 w-72 origin-(--bits-popover-content-transform-origin) superficie-fuerte p-3 text-sm text-texto motion-safe:data-[state=closed]:animate-salida-panel motion-safe:data-[state=open]:animate-entrada-panel"
    >
      <Popover.Close
        aria-label="Cerrar"
        class="absolute top-2 right-2 flex size-7 items-center justify-center text-texto hover:bg-hover"
      >
        <X size={18} aria-hidden="true" />
      </Popover.Close>
      <h2 id="ayuda-titulo" class="flex items-center gap-2 text-base font-medium sm:text-xl">
        <HelpCircle size={24} aria-hidden="true" class="shrink-0 text-link-fuerte" />
        Ayuda
      </h2>
      <ul class="mt-3 flex flex-col gap-1">
        {#each opciones as { id, icono: Icono, texto, ...destino }}
          <li>
            <button
              type="button"
              onclick={() => {
                track({ nombre: "ayuda_opcion_clic", opcion: id });
                resaltar(destino);
              }}
              class="flex w-full cursor-pointer items-start gap-2 p-1.5 text-left text-sm hover:bg-hover focus-visible:-outline-offset-2"
            >
              <Icono size={24} class="shrink-0" aria-hidden="true" />
              <span>{texto}</span>
            </button>
          </li>
        {/each}
      </ul>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  /* 2 pulsos de 1.5s = 3s en total. En modo claro el color se oscurece para que destaque. */
  :global(.ayuda-destacada) {
    --halo: color-mix(in oklab, var(--color-link-outline) 70%, black);
    animation: ayuda-halo 1.5s ease-out 2;
  }

  :global(.dark .ayuda-destacada) {
    --halo: var(--color-link-outline);
  }

  @keyframes ayuda-halo {
    0% {
      box-shadow: 0 0 0 0 color-mix(in oklab, var(--halo) 75%, transparent);
    }
    100% {
      box-shadow: 0 0 0 14px transparent;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.ayuda-destacada) {
      animation: none;
    }
  }
</style>
