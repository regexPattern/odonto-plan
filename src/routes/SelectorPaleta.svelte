<script lang="ts">
  import Palette from "@withicons/svelte/kawaii/icons/palette";
  import { Popover } from "bits-ui";
  import { setMode, userPrefersMode } from "mode-watcher";
  import { PALETAS } from "#lib/palette/index.js";
  import paleta from "#lib/palette/state.svelte.js";

  const MODOS = [
    { id: "system", nombre: "Sistema" },
    { id: "light", nombre: "Claro" },
    { id: "dark", nombre: "Oscuro" },
  ] as const;

  const opcion =
    "border border-borde bg-transparent px-3 py-2 text-texto hover:bg-hover focus-visible:outline-2 focus-visible:outline-link-outline aria-pressed:border-borde-activo aria-pressed:bg-seleccion";
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
      class="z-50 w-72 origin-(--bits-popover-content-transform-origin) border border-borde bg-panel-fuerte p-3 text-sm text-texto shadow-lg backdrop-blur-xl motion-safe:data-[state=open]:animate-entrada-panel"
    >
      <section aria-labelledby="modo-titulo">
        <h2 id="modo-titulo" class="font-serif text-base font-medium">Tema</h2>
        <div class="mt-2 grid grid-cols-3 gap-1.5">
          {#each MODOS as { id, nombre } (id)}
            <button
              type="button"
              class={opcion}
              aria-pressed={userPrefersMode.current === id}
              onclick={() => setMode(id)}
            >
              {nombre}
            </button>
          {/each}
        </div>
        <p class="mt-1.5 text-xs text-texto-tenue">
          «Sistema» sigue el tema claro u oscuro de tu dispositivo.
        </p>
      </section>

      <section class="mt-4" aria-labelledby="paleta-titulo">
        <h2 id="paleta-titulo" class="font-serif text-base font-medium">Paleta</h2>
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
