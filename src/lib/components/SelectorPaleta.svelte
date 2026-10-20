<script lang="ts">
  import X from "@withicons/svelte/kawaii/icons/close";
  import Monitor from "@withicons/svelte/kawaii/icons/monitor";
  import Moon from "@withicons/svelte/kawaii/icons/moon";
  import Palette from "@withicons/svelte/kawaii/icons/palette";
  import Sun from "@withicons/svelte/kawaii/icons/sun";
  import { Popover } from "bits-ui";
  import { setMode, userPrefersMode } from "mode-watcher";
  import { registrarPreferencias, track } from "#lib/analytics.js";
  import { animar } from "#lib/animar.js";
  import { PALETAS } from "#lib/palette/index.js";
  import paleta from "#lib/palette/state.svelte.js";

  const MODOS = [
    { id: "system", nombre: "Auto", Icono: Monitor, ajuste: "" },
    { id: "light", nombre: "Claro", Icono: Sun, ajuste: "" },
    { id: "dark", nombre: "Oscuro", Icono: Moon, ajuste: "ml-[3px] -mr-[3px]" },
  ] as const;

  const elegirModo = (id: (typeof MODOS)[number]["id"]) => {
    setMode(id);
    registrarPreferencias({ modo: id });
    track({ nombre: "modo_elegido", modo: id });
  };

  const opcion =
    "border border-borde bg-transparent px-3 py-2 text-texto hover:bg-hover aria-pressed:bg-seleccion";
</script>

<Popover.Root>
  <Popover.Trigger
    class="boton-herramienta wm-trigger"
    aria-label="Paleta de colores"
    title="Paleta de colores"
  >
    <span class="flex shrink-0" use:animar={{ nombre: "palette" }}><Palette size={24} /></span>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      side="bottom"
      align="center"
      sideOffset={8}
      collisionPadding={8}
      aria-labelledby="apariencia-titulo"
      class="relative z-50 w-72 origin-(--bits-popover-content-transform-origin) superficie-fuerte p-3 text-sm text-texto motion-safe:data-[state=closed]:animate-salida-panel motion-safe:data-[state=open]:animate-entrada-panel"
    >
      <Popover.Close
        aria-label="Cerrar"
        class="absolute top-2 right-2 flex size-7 items-center justify-center text-texto hover:bg-hover"
      >
        <X size={18} aria-hidden="true" />
      </Popover.Close>
      <h2 id="apariencia-titulo" class="flex items-center gap-2 text-base font-medium sm:text-xl">
        <Palette size={24} aria-hidden="true" class="shrink-0 text-link-fuerte" />
        Apariencia
      </h2>

      <section class="mt-4" aria-label="Tema">
        <div class="grid grid-cols-3 gap-1.5 border border-borde p-1.5">
          {#each MODOS as { id, nombre, Icono, ajuste } (id)}
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 px-2.5 py-2 text-sm font-medium text-texto hover:bg-hover aria-pressed:bg-seleccion"
              aria-pressed={userPrefersMode.current === id}
              onclick={() => elegirModo(id)}
            >
              <Icono size={16} aria-hidden="true" class="shrink-0 text-link-fuerte {ajuste}" />
              {nombre}
            </button>
          {/each}
        </div>
      </section>

      <section class="mt-4" aria-labelledby="paleta-titulo">
        <h3 id="paleta-titulo" class="text-base font-medium">Paleta de colores</h3>
        <ul class="mt-2 space-y-1.5">
          {#each PALETAS as { id, nombre } (id)}
            <li>
              <!-- `data-palette` hace que las muestras usen los colores de esta paleta. -->
              <button
                type="button"
                data-palette={id}
                class="{opcion} flex w-full items-center justify-between gap-3 text-left"
                aria-pressed={paleta.actual === id}
                onclick={() => paleta.elegir(id)}
              >
                {nombre}
                <span class="flex shrink-0 gap-1" aria-hidden="true">
                  <span class="size-5 border-2 border-border-aprobada bg-bg-aprobada"></span>
                  <span class="size-5 border-2 border-border-desbloqueada bg-bg-desbloqueada"
                  ></span>
                  <span
                    class="size-5 border-2 border-dashed border-border-bloqueada bg-bg-bloqueada"
                  ></span>
                  <span class="size-5 border-2 border-link-border bg-link"></span>
                </span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
