<script lang="ts">
  import Monitor from "@withicons/svelte/kawaii/icons/monitor";
  import Moon from "@withicons/svelte/kawaii/icons/moon";
  import Palette from "@withicons/svelte/kawaii/icons/palette";
  import Sun from "@withicons/svelte/kawaii/icons/sun";
  import { Popover } from "bits-ui";
  import { setMode, userPrefersMode } from "mode-watcher";
  import { PALETAS } from "#lib/palette/index.js";
  import paleta from "#lib/palette/state.svelte.js";

  const MODOS = [
    { id: "system", nombre: "Sistema", Icono: Monitor },
    { id: "light", nombre: "Claro", Icono: Sun },
    { id: "dark", nombre: "Oscuro", Icono: Moon },
  ] as const;

  const opcion =
    "border border-borde bg-transparent px-3 py-2 text-texto hover:bg-hover focus-visible:outline-2 focus-visible:outline-link-outline aria-pressed:bg-seleccion";
</script>

<Popover.Root>
  <Popover.Trigger
    class="boton-herramienta wm-trigger"
    aria-label="Paleta de colores"
    title="Paleta de colores"
  >
    <Palette size={24} class="wm wm-hover" data-wm="palette" />
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      side="bottom"
      align="center"
      sideOffset={8}
      collisionPadding={8}
      aria-labelledby="apariencia-titulo"
      class="z-50 w-72 origin-(--bits-popover-content-transform-origin) superficie-fuerte p-3 text-sm text-texto motion-safe:data-[state=open]:animate-entrada-panel"
    >
      <h2 id="apariencia-titulo" class="flex items-center gap-2 font-serif text-xl font-medium">
        <Palette size={24} aria-hidden="true" class="shrink-0 text-link-fuerte" />
        Apariencia
      </h2>

      <section class="mt-4" aria-label="Tema">
        <div class="grid grid-cols-3 border border-borde">
          {#each MODOS as { id, nombre, Icono } (id)}
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 px-2 py-2 text-sm font-medium text-texto hover:bg-hover focus-visible:outline-2 focus-visible:outline-link-outline aria-pressed:bg-seleccion"
              aria-pressed={userPrefersMode.current === id}
              onclick={() => setMode(id)}
            >
              <Icono size={16} aria-hidden="true" class="shrink-0 text-link-fuerte" />
              {nombre}
            </button>
          {/each}
        </div>
        <p class="mt-1.5 text-xs text-texto-tenue">
          «Sistema» sigue el tema claro u oscuro de tu dispositivo.
        </p>
      </section>

      <section class="mt-4" aria-labelledby="paleta-titulo">
        <h3 id="paleta-titulo" class="font-serif text-base font-medium">Paleta de colores</h3>
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
