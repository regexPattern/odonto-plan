<script lang="ts">
  import { animar } from "#lib/animar.js";
  import {
    CORREO_SOPORTE as CORREO,
    PERFIL_GITHUB_URL,
    PERFIL_LINKEDIN_URL,
  } from "$app/env/public";
  import ArrowUpRight from "@withicons/svelte/kawaii/icons/arrow-up-right";
  import IdCard from "@withicons/svelte/kawaii/icons/id-card";
  import Mail from "@withicons/svelte/kawaii/icons/mail";
  import MailCheck from "@withicons/svelte/kawaii/icons/mail-check";
  import { Popover } from "bits-ui";

  let copiado = $state(false);
  let temporizador: ReturnType<typeof setTimeout>;

  async function copiarCorreo() {
    try {
      await navigator.clipboard.writeText(CORREO);
    } catch {
      return;
    }
    copiado = true;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => (copiado = false), 2000);
  }
</script>

<Popover.Root>
  <Popover.Trigger
    class="boton-herramienta wm-trigger"
    aria-label="Enlaces de contacto"
    title="Enlaces de contacto"
  >
    <span class="flex shrink-0" use:animar={{ nombre: "id-card" }}><IdCard size={24} /></span>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      side="bottom"
      align="center"
      sideOffset={8}
      collisionPadding={8}
      class="z-50 min-w-40 origin-(--bits-popover-content-transform-origin) superficie-fuerte p-1 text-sm text-texto motion-safe:data-[state=open]:animate-entrada-panel motion-safe:data-[state=closed]:animate-salida-panel"
    >
      <nav aria-label="Redes sociales">
        <ul>
          <li>
            <a
              href={PERFIL_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-2 hover:bg-hover focus-visible:-outline-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                class="size-4 shrink-0 text-[#0A66C2]"
                fill="currentColor"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"
                />
              </svg>
              <span class="flex-1">LinkedIn</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span class="sr-only">(abre en una pestaña nueva)</span>
            </a>
          </li>
          <li>
            <a
              href={PERFIL_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-2 hover:bg-hover focus-visible:-outline-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                class="size-4 shrink-0"
                fill="currentColor"
              >
                <path
                  d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z"
                />
              </svg>
              <span class="flex-1">GitHub</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span class="sr-only">(abre en una pestaña nueva)</span>
            </a>
          </li>
          <li>
            <button
              type="button"
              onclick={copiarCorreo}
              class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-hover focus-visible:-outline-offset-2"
            >
              {#if copiado}
                <MailCheck size={16} aria-hidden="true" class="shrink-0 text-link-fuerte" />
              {:else}
                <Mail size={16} aria-hidden="true" class="shrink-0" />
              {/if}
              <span class="grid flex-1" aria-hidden="true">
                <span
                  class="col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none {copiado
                    ? 'opacity-0'
                    : ''}">{CORREO}</span
                >
                <span
                  class="col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none {copiado
                    ? ''
                    : 'opacity-0'}">¡Copiado!</span
                >
              </span>
              <span class="sr-only" role="status">
                {copiado ? "Correo copiado al portapapeles" : "Copiar correo"}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
