<script lang="ts">
  import { Calendar, Clock, Star, Tooth } from "@withicons/svelte/kawaii";
  import MousePointerClick from "@withicons/svelte/kawaii/icons/mouse-pointer-click";
  import { esCalificacionAprobada } from "#lib/graph/index.js";
  import graph from "#lib/graph/state.svelte.js";
  import { guardarMateriasAprobadas } from "#lib/graph/storage.js";
  import { validarCambioCalificacion } from "#lib/plan/calificacion.js";

  let materiaSeleccionada = $derived(graph.materiaSeleccionada);
  let calificacion = $derived(materiaSeleccionada?.calificacion ?? 0);
  let error = $state<{ codigo: string; mensaje: string } | null>(null);

  $effect(() => {
    materiaSeleccionada?.codigo;
    error = null;
  });

  const bloquearInteraccion = (event: PointerEvent | KeyboardEvent) => {
    if (materiaSeleccionada?.estado !== "bloqueada") return;
    if (
      event instanceof KeyboardEvent &&
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ].includes(event.key)
    )
      return;

    event.preventDefault();
    (event.currentTarget as HTMLInputElement).focus();
    const mensaje = validarCambioCalificacion(
      materiaSeleccionada.codigo,
      4,
      new Set(graph.materiasAprobadas.map(({ codigo }) => codigo)),
    );
    if (mensaje) error = { codigo: materiaSeleccionada.codigo, mensaje };
  };

  const handleInput = (event: Event) => {
    if (!materiaSeleccionada) return;

    const input = event.currentTarget as HTMLInputElement;
    const nuevaCalificacion = input.valueAsNumber;
    const codigoMateria = materiaSeleccionada.codigo;
    const mensaje = validarCambioCalificacion(
      codigoMateria,
      nuevaCalificacion,
      new Set(graph.materiasAprobadas.map(({ codigo }) => codigo)),
    );
    if (mensaje) {
      error = { codigo: codigoMateria, mensaje };
      input.value = String(calificacion);
      return;
    }

    error = null;
    const materiasAprobadas = graph.materiasAprobadas.filter(
      ({ codigo }) => codigo !== codigoMateria,
    );
    if (esCalificacionAprobada(nuevaCalificacion)) {
      materiasAprobadas.push({ codigo: codigoMateria, calificacion: nuevaCalificacion });
    }
    graph.materiasAprobadas = materiasAprobadas;
    calificacion = nuevaCalificacion;
    guardarMateriasAprobadas(graph.materiasAprobadas);
  };
</script>

<div
  class={[
    "divide-y divide-borde superficie *:p-3 max-lg:max-h-[50dvh] max-lg:overflow-y-auto max-lg:overscroll-contain lg:w-72",
    // En mobile el panel solo aparece cuando hay una materia seleccionada.
    !materiaSeleccionada && "max-lg:hidden",
  ]}
>
  {#if materiaSeleccionada}
    <h1 class="font-serif text-lg leading-snug font-medium sm:text-xl">
      {materiaSeleccionada.nombre}
    </h1>
    <div class="grid grid-cols-2 gap-2 lg:grid-cols-1">
      <div class="wm-trigger flex items-start gap-2">
        <Calendar size={24} class="wm wm-hover shrink-0" data-wm="calendar" aria-hidden="true" />
        <div><span class="font-medium">Duración:</span> {materiaSeleccionada.duracion}</div>
      </div>
      <div class="wm-trigger flex items-start gap-2">
        <Clock
          size={24}
          class="wm wm-hover wm-p-wiggle shrink-0"
          data-wm="clock"
          aria-hidden="true"
        />
        <div><span class="font-medium">Carga horaria:</span> {materiaSeleccionada.horas}</div>
      </div>
    </div>
    <div>
      <div class="wm-trigger mb-2 flex items-start gap-2">
        <span class="flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
          <Star size={28} class="wm wm-hover wm-p-pop shrink-0" data-wm="star" />
        </span>
        <label for="calificacion" class="font-medium">Calificación</label>
      </div>
      {#key materiaSeleccionada.codigo}
        <div
          class="relative h-8"
          style={`--progreso: ${calificacion * 10}%; --slider-bg: var(--color-bg-${materiaSeleccionada.estado}); --slider-fg: var(--color-fg-${materiaSeleccionada.estado})`}
        >
          <div
            class="absolute inset-x-3 inset-y-[7px] rounded-full bg-pista ring-1 ring-pista-anillo"
            aria-hidden="true"
          >
            {#if materiaSeleccionada.estado !== "bloqueada"}
              <div
                class="absolute inset-0 rounded-full bg-(--slider-bg) [clip-path:inset(0_calc(100%-var(--progreso))_0_0_round_999px)] motion-safe:transition-colors motion-safe:duration-200"
              ></div>
            {/if}
          </div>
          <input
            id="calificacion"
            type="range"
            min="0"
            max="10"
            step="1"
            value={calificacion}
            aria-label={`Calificación de ${materiaSeleccionada.nombre}`}
            aria-describedby={error?.codigo === materiaSeleccionada.codigo
              ? "calificacion-error"
              : undefined}
            aria-disabled={materiaSeleccionada.estado === "bloqueada"}
            onpointerdown={bloquearInteraccion}
            onkeydown={bloquearInteraccion}
            oninput={handleInput}
            class="calificacion-input peer relative m-0 block h-8 w-full cursor-pointer bg-transparent p-0 outline-none aria-disabled:cursor-not-allowed"
          />
          <span
            class="pointer-events-none absolute inset-x-1.5 inset-y-px rounded-[15px] border-2 border-(--slider-bg) opacity-0 peer-focus-visible:opacity-100 motion-safe:transition-colors motion-safe:duration-200"
            aria-hidden="true"
          ></span>
          <span
            class="pointer-events-none absolute top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 text-(--slider-fg) [&>svg]:drop-shadow-[0_1px_2px_rgb(0_0_0/0.4)] motion-safe:transition-colors motion-safe:duration-200 [&>svg>path:first-child]:fill-(--slider-bg) [&>svg>path:first-child]:[fill-opacity:1] motion-safe:[&>svg>path:first-child]:transition-[fill] motion-safe:[&>svg>path:first-child]:duration-200"
            style:left={`calc(${calificacion * 10}% + ${12 - calificacion * 2.4}px)`}
            aria-hidden="true"
          >
            <Tooth size={24} />
          </span>
        </div>
      {/key}
      <div class="relative h-4 text-xs text-texto-tenue" aria-hidden="true">
        {#each Array.from({ length: 11 }, (_, numero) => numero) as numero}
          <span
            class="absolute -translate-x-1/2"
            style:left={`calc(${numero * 10}% + ${12 - numero * 2.4}px)`}
          >
            {numero}
          </span>
        {/each}
      </div>
      {#if error?.codigo === materiaSeleccionada.codigo}
        <p
          id="calificacion-error"
          role="alert"
          class="mt-2 text-sm text-amber-600 dark:text-amber-400"
        >
          {error.mensaje}
        </p>
      {/if}
    </div>
  {:else}
    <div class="flex items-start gap-2">
      <MousePointerClick size={24} class="shrink-0" aria-hidden="true" />
      <div>Hacé clic en una materia para ver sus detalles o afuera para volver.</div>
    </div>
  {/if}
</div>

<style>
  /* Los pseudo-elementos del input nativo no se pueden estilar con utilidades. */
  .calificacion-input {
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-y;
  }

  .calificacion-input::-webkit-slider-runnable-track {
    height: 18px;
    background: transparent;
  }

  .calificacion-input::-moz-range-track {
    height: 18px;
    background: transparent;
  }

  .calificacion-input::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
    margin-top: -3px;
    appearance: none;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .calificacion-input::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
</style>
