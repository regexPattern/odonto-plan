<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import CloudUpload from "@withicons/svelte/kawaii/icons/cloud-upload";
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

  const nombres = new Map(MATERIAS.map(({ codigo, nombre }) => [codigo, nombre]));
  const boton = "border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50";
  const campo = "w-full border border-zinc-600 bg-zinc-900 p-2 font-mono";

  let dialog: HTMLDialogElement;
  let abierto = $state(false);
  let entrada = $state("");
  let previa = $state<MateriaAprobada[] | null>(null);
  let anterior = $state<MateriaAprobada[] | null>(null);
  let error = $state("");
  let aviso = $state("");

  const codigo = $derived(codificar(graph.materiasAprobadas));
  const enlace = $derived(crearEnlace(codigo, window.location));

  const generarQR = async (texto: string) => {
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

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      error = "";
      aviso = "Copiado.";
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

<dialog
  bind:this={dialog}
  aria-labelledby="sync-titulo"
  onclose={() => {
    // El evento es asíncrono: no pisar un enlace que ya reabrió el diálogo.
    if (dialog.open) return;
    abierto = false;
    previa = null;
    error = aviso = "";
  }}
  class="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-100 backdrop:bg-black/70"
>
  {#if abierto}
    <div class="flex items-center justify-between">
      <h2 id="sync-titulo" class="text-xl font-semibold">Sincronizar progreso</h2>
      <button type="button" class={boton} onclick={() => dialog.close()}>Cerrar</button>
    </div>
    <p class="mt-2 text-zinc-300">
      Copiás una instantánea de tus notas: los cambios posteriores no se sincronizan solos. El
      código, el enlace y el QR no están cifrados; quien los tenga puede leer tus notas.
    </p>

    <h3 class="mt-4 text-base font-medium">Enviar a otro dispositivo</h3>
    {#await generarQR(enlace) then src}
      <img {src} alt="QR para importar tu progreso" class="mx-auto my-2 size-48 bg-white" />
    {/await}
    <label class="block" for="sync-enlace">Enlace</label>
    <input id="sync-enlace" readonly value={enlace} class={campo} />
    <button type="button" class="{boton} mt-1" onclick={() => copiar(enlace)}>Copiar enlace</button>
    <label class="mt-2 block" for="sync-codigo">Código</label>
    <input id="sync-codigo" readonly value={codigo} class={campo} />
    <button type="button" class="{boton} mt-1" onclick={() => copiar(codigo)}>Copiar código</button>

    <h3 class="mt-4 text-base font-medium">Recibir en este dispositivo</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault();
        previsualizar();
      }}
    >
      <label class="block" for="sync-entrada">Pegá un código o enlace</label>
      <input
        id="sync-entrada"
        bind:value={entrada}
        oninput={() => (previa = null)}
        spellcheck="false"
        autocomplete="off"
        class={campo}
      />
      <button type="submit" class="{boton} mt-1">Previsualizar</button>
    </form>

    {#if previa}
      <section class="mt-3 border border-teal-700 p-3">
        <p>
          Recibís <strong>{previa.length} de {MATERIAS.length}</strong> materias aprobadas. Al
          confirmar se <strong>reemplaza</strong> tu progreso actual (no se combina).
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
          <button type="button" class={boton} onclick={() => (previa = null)}>Cancelar</button>
        </div>
      </section>
    {/if}

    {#if error}<p role="alert" class="mt-3 text-red-300">{error}</p>{/if}
    {#if aviso}<p role="status" class="mt-3 text-teal-200">{aviso}</p>{/if}

    {#if anterior}
      <div class="mt-4 border-t border-zinc-700 pt-3">
        <p class="text-zinc-300">
          Podés volver al progreso previo a la importación (se pierden los cambios hechos después).
          Solo disponible hasta recargar la página.
        </p>
        <button type="button" class="{boton} mt-1" onclick={deshacer}>
          Deshacer última importación
        </button>
      </div>
    {/if}
  {/if}
</dialog>
