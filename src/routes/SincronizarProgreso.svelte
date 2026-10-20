<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import AlertTriangle from "@withicons/svelte/kawaii/icons/alert-triangle";
  import ChevronDown from "@withicons/svelte/kawaii/icons/chevron-down";
  import Clipboard from "@withicons/svelte/kawaii/icons/clipboard";
  import ClipboardCheck from "@withicons/svelte/kawaii/icons/clipboard-check";
  import CloudUpload from "@withicons/svelte/kawaii/icons/cloud-upload";
  import FileDown from "@withicons/svelte/kawaii/icons/file-down";
  import FileUp from "@withicons/svelte/kawaii/icons/file-up";
  import DienteSolido from "@withicons/svelte/solid/icons/tooth";
  import { Accordion } from "bits-ui";
  import { onMount } from "svelte";
  import type { MateriaAprobada } from "#lib/graph/index.js";
  import graph from "#lib/graph/state.svelte.js";
  import { guardarMateriasAprobadas } from "#lib/graph/storage.js";
  import {
    codificar,
    crearEnlace,
    decodificar,
    MATERIAS,
    PREFIJO_FRAGMENTO,
  } from "#lib/sync/codigo.js";

  const DIENTES_POR_LADO = 8;
  const dientes = Array.from({ length: DIENTES_POR_LADO ** 2 }, (_, i) => ({
    // Onda diagonal: el retraso crece con fila + columna. Se resta el periodo (1.4s) para que
    // la onda arranque ya en marcha y no haya un primer pulso aislado en la esquina.
    retraso: ((i % DIENTES_POR_LADO) + Math.floor(i / DIENTES_POR_LADO)) * 0.1,
  }));

  const nombres = new Map(MATERIAS.map(({ codigo, nombre }) => [codigo, nombre]));
  const boton = "border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50";
  const campo = "w-full border border-zinc-600 bg-zinc-900 px-3 py-2.5 font-mono";

  let dialog: HTMLDialogElement;
  let abierto = $state(false);
  let entrada = $state("");
  let previa = $state<MateriaAprobada[] | null>(null);
  let anterior = $state<MateriaAprobada[] | null>(null);
  let error = $state("");
  let aviso = $state("");
  let seccion = $state("");
  let copiado = $state("");
  let temporizador: ReturnType<typeof setTimeout>;

  const codigo = $derived(codificar(graph.materiasAprobadas));
  const enlace = $derived(crearEnlace(codigo, window.location));

  const generarQR = async (texto: string) => {
    // Solo en `vite dev`: permite ver el skeleton. Se elimina del build de producción.
    if (import.meta.env.DEV) await new Promise((r) => setTimeout(r, 3000));
    const { default: QRCode } = await import("qrcode");
    return QRCode.toDataURL(texto, { errorCorrectionLevel: "M", margin: 2, width: 256 });
  };

  function abrir() {
    abierto = true;
    if (!dialog.open) dialog.showModal();
  }

  function previsualizar() {
    error = aviso = "";
    previa = null;
    try {
      previa = decodificar(entrada);
    } catch (e) {
      error = (e as Error).message;
    }
  }

  // Guardar antes de aplicar: si el almacenamiento falla, el grafo queda intacto.
  function aplicar(materias: MateriaAprobada[], mensaje: string) {
    try {
      guardarMateriasAprobadas(materias);
    } catch {
      error = "No se pudo guardar en este dispositivo. No se aplicaron cambios.";
      return false;
    }
    graph.materiasAprobadas = materias;
    error = "";
    aviso = mensaje;
    return true;
  }

  function reemplazar() {
    const actual = graph.materiasAprobadas;
    if (previa && aplicar(previa, "Progreso importado y guardado.")) {
      anterior = actual;
      previa = null;
      entrada = "";
    }
  }

  function deshacer() {
    if (anterior && aplicar(anterior, "Se restauró el progreso anterior a la importación.")) {
      anterior = null;
    }
  }

  async function copiar(id: string, texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      error = "";
      copiado = id;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => (copiado = ""), 2000);
    } catch {
      error = "No se pudo copiar automáticamente. Seleccioná el texto y copialo manualmente.";
    }
  }

  onMount(() => {
    // Un enlace compartido solo abre la previsualización: nunca importa sin confirmar.
    const leerFragmento = () => {
      const hash = window.location.hash;
      if (!hash.startsWith(PREFIJO_FRAGMENTO)) return;
      replaceState(window.location.pathname + window.location.search, page.state);
      entrada = hash;
      seccion = "importar";
      abrir();
      previsualizar();
    };
    leerFragmento();
    window.addEventListener("hashchange", leerFragmento);
    return () => window.removeEventListener("hashchange", leerFragmento);
  });
</script>

<button
  type="button"
  class="boton-herramienta wm-trigger"
  aria-label="Sincronizar progreso"
  title="Sincronizar progreso"
  onclick={abrir}
>
  <CloudUpload size={24} class="wm wm-hover wm-p-rise" data-wm="cloud-upload" />
</button>

{#snippet campoCopiable(id: string, etiqueta: string, texto: string)}
  <span class="mb-1.5 block text-zinc-300" id="sync-{id}-etiqueta">{etiqueta}</span>
  <button
    type="button"
    aria-labelledby="sync-{id}-etiqueta"
    onclick={() => copiar(id, texto)}
    class="{campo} flex cursor-pointer items-center gap-2 text-left hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-teal-400"
  >
    <span class="grid min-w-0 flex-1" aria-hidden="true">
      <span
        class="col-start-1 row-start-1 truncate transition-opacity duration-150 motion-reduce:transition-none {copiado ===
        id
          ? 'opacity-0'
          : ''}">{texto}</span
      >
      <span
        class="col-start-1 row-start-1 font-sans text-teal-300 transition-opacity duration-150 motion-reduce:transition-none {copiado ===
        id
          ? ''
          : 'opacity-0'}">¡Copiado!</span
      >
    </span>
    {#if copiado === id}
      <ClipboardCheck size={16} aria-hidden="true" class="shrink-0 text-teal-300" />
    {:else}
      <Clipboard size={16} aria-hidden="true" class="shrink-0" />
    {/if}
    <span class="sr-only" role="status">
      {copiado === id ? `${etiqueta} copiado al portapapeles` : `Copiar ${etiqueta.toLowerCase()}`}
    </span>
  </button>
{/snippet}

<dialog
  bind:this={dialog}
  aria-labelledby="sync-titulo"
  onclose={() => {
    // El evento es asíncrono: no pisar un enlace que ya reabrió el diálogo.
    if (dialog.open) return;
    abierto = false;
    previa = null;
    copiado = "";
    error = aviso = "";
  }}
  class="entrada-dialog fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-100 backdrop:bg-black/70"
>
  {#if abierto}
    <div class="flex items-center justify-between">
      <h2 id="sync-titulo" class="flex items-center gap-2 font-serif text-xl font-medium">
        <CloudUpload size={24} aria-hidden="true" class="shrink-0 text-teal-300" />
        Sincronizar progreso
      </h2>
      <button type="button" class={boton} onclick={() => dialog.close()}>Cerrar</button>
    </div>

    <div
      class="mt-3 flex gap-2 border border-amber-500/40 bg-amber-500/10 p-3 text-amber-200"
      role="note"
    >
      <AlertTriangle size={18} aria-hidden="true" class="mt-0.5 shrink-0 text-amber-400" />
      <p>
        <strong class="font-medium">La sincronización es manual.</strong> Copiás una instantánea de tus
        notas. Los cambios posteriores no se actualizan solos, sino que tenés que irlos cargando a medida
        los vas registrando en cada cuatrimestre.
      </p>
    </div>

    <Accordion.Root type="single" bind:value={seccion} class="mt-4 space-y-1.5">
      <Accordion.Item value="exportar" class="border border-zinc-700">
        <Accordion.Header>
          <Accordion.Trigger
            class="group flex w-full items-center gap-2 px-3 py-3 text-left hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-teal-400"
          >
            <FileUp size={20} aria-hidden="true" class="shrink-0 text-teal-300" />
            <span class="flex-1 text-base font-medium">Enviar a otro dispositivo</span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              class="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="acordeon-contenido overflow-hidden">
          <div class="px-4 pt-1 pb-4">
            <ol class="list-decimal space-y-1 pl-5 text-zinc-300">
              <li>
                En el otro dispositivo, escaneá el QR con la cámara o abrí el enlace en el
                navegador.
              </li>
              <li>
                O también podés copiar el código y pegarlo en "Recibir en este dispositivo" desde el
                otro dispositivo.
              </li>
              <li>Revisá la previsualización y confirmá.</li>
            </ol>
            <div class="mx-auto my-4 size-48">
              {#await generarQR(enlace)}
                <div class="qr-skeleton" role="status" aria-label="Generando código QR">
                  {#each dientes as { retraso }}
                    <DienteSolido
                      size={16}
                      aria-hidden="true"
                      class="diente"
                      style="animation-delay: {retraso - 1.4}s"
                    />
                  {/each}
                </div>
              {:then src}
                <img {src} alt="QR para importar tu progreso" class="qr-listo size-full bg-white" />
              {/await}
            </div>
            {@render campoCopiable("enlace", "Enlace", enlace)}
            <div class="mt-4">{@render campoCopiable("codigo", "Código", codigo)}</div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="importar" class="border border-zinc-700">
        <Accordion.Header>
          <Accordion.Trigger
            class="group flex w-full items-center gap-2 px-3 py-3 text-left hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-teal-400"
          >
            <FileDown size={20} aria-hidden="true" class="shrink-0 text-teal-300" />
            <span class="flex-1 text-base font-medium">Recibir en este dispositivo</span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              class="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="acordeon-contenido overflow-hidden">
          <div class="px-4 pt-1 pb-4">
            <ol class="list-decimal space-y-1 pl-5 text-zinc-300">
              <li>En el otro dispositivo abrí "Enviar a otro dispositivo".</li>
              <li>Copiá el enlace o el código (o escaneá el QR).</li>
              <li>Pegalo acá abajo para previsualizar los cambios.</li>
              <li>Si las notas son correctas, confirmá con "Reemplazar mi progreso".</li>
            </ol>
            <form
              class="mt-4 space-y-1.5"
              onsubmit={(e) => {
                e.preventDefault();
                previsualizar();
              }}
            >
              <label class="block" for="sync-entrada">Pegá un código o enlace</label>
              <input
                id="sync-entrada"
                bind:value={entrada}
                oninput={(e) => {
                  previa = null;
                  // Al pegar, previsualiza solo; al tipear espera a Enter.
                  if ((e as InputEvent).inputType === "insertFromPaste") previsualizar();
                }}
                spellcheck="false"
                autocomplete="off"
                class={campo}
              />
            </form>

            {#if previa}
              <section class="mt-4 border border-teal-700 p-4">
                <p>
                  Recibís <strong>{previa.length} de {MATERIAS.length}</strong> materias aprobadas.
                  Al confirmar se <strong>reemplaza</strong> tu progreso actual (no se combina).
                </p>
                {#if previa.length}
                  <details class="mt-2">
                    <summary class="cursor-pointer">Ver notas recibidas</summary>
                    <ul>
                      {#each previa as { codigo, calificacion } (codigo)}
                        <li>{nombres.get(codigo)}: <strong>{calificacion}</strong></li>
                      {/each}
                    </ul>
                  </details>
                {/if}
                <div class="mt-3 flex gap-2">
                  <button type="button" class="{boton} bg-teal-800" onclick={reemplazar}>
                    Reemplazar mi progreso
                  </button>
                  <button type="button" class={boton} onclick={() => (previa = null)}
                    >Cancelar</button
                  >
                </div>
              </section>
            {/if}

            {#if anterior}
              <div class="mt-4 border-t border-zinc-700 pt-3">
                <p class="text-zinc-300">
                  Podés volver al progreso previo a la importación (se pierden los cambios hechos
                  después). Solo disponible hasta recargar la página.
                </p>
                <button type="button" class="{boton} mt-1" onclick={deshacer}>
                  Deshacer última importación
                </button>
              </div>
            {/if}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    {#if error}<p role="alert" class="mt-3 text-red-300">{error}</p>{/if}
    {#if aviso}<p role="status" class="mt-3 text-teal-200">{aviso}</p>{/if}
  {/if}
</dialog>

<style>
  .qr-skeleton {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 4px;
    overflow: hidden;
    border: 1px solid var(--color-zinc-700);
    background-color: var(--color-zinc-900);
  }
  .qr-skeleton :global(.diente) {
    color: var(--color-zinc-700);
    animation: qr-onda 1.4s ease-in-out infinite;
  }
  /* Al cambiar de acordeón conviven un instante el que cierra y el que abre: sin esto asoma la scrollbar. */
  dialog:has(:global(.acordeon-contenido[data-state="closed"])) {
    overflow-y: hidden;
  }
  :global(.acordeon-contenido[data-state="open"]) {
    animation: acordeon-abrir 0.2s ease-out;
  }
  :global(.acordeon-contenido[data-state="closed"]) {
    animation: acordeon-cerrar 0.2s ease-out;
  }
  @keyframes acordeon-abrir {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: var(--bits-accordion-content-height);
      opacity: 1;
    }
  }
  @keyframes acordeon-cerrar {
    from {
      height: var(--bits-accordion-content-height);
      opacity: 1;
    }
    to {
      height: 0;
      opacity: 0;
    }
  }
  .qr-listo {
    animation: qr-aparecer 0.25s ease-out;
  }
  @keyframes qr-onda {
    0%,
    100% {
      opacity: 0.25;
    }
    40% {
      opacity: 1;
    }
  }
  @keyframes qr-aparecer {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .qr-skeleton :global(.diente),
    .qr-listo {
      animation: none;
    }
    :global(.acordeon-contenido) {
      animation: none !important;
    }
  }
</style>
