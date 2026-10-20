<script lang="ts">
  import { Calendar, Clock, Star, Tooth } from "@withicons/svelte/kawaii";
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
  class="w-72 divide-y divide-zinc-700/70 border border-zinc-700/70 bg-[#141414]/50 backdrop-blur-xl *:p-3"
>
  {#if materiaSeleccionada}
    <h1 class="font-serif text-xl leading-snug font-medium">
      {materiaSeleccionada.nombre}
    </h1>
    <div class="space-y-2">
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
          class="calificacion-slider"
          class:bloqueada={materiaSeleccionada.estado === "bloqueada"}
          style={`--progreso: ${calificacion * 10}%; --slider-bg: var(--color-bg-${materiaSeleccionada.estado}); --slider-fg: var(--color-fg-${materiaSeleccionada.estado})`}
        >
          <div class="calificacion-carril" aria-hidden="true"></div>
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
            class="calificacion-input"
          />
          <span
            class="calificacion-thumb"
            style:left={`calc(${calificacion * 10}% + ${12 - calificacion * 2.4}px)`}
            aria-hidden="true"
          >
            <Tooth size={24} />
          </span>
        </div>
      {/key}
      <div class="calificacion-marcas text-xs text-zinc-400" aria-hidden="true">
        {#each Array.from({ length: 11 }, (_, numero) => numero) as numero}
          <span style:left={`calc(${numero * 10}% + ${12 - numero * 2.4}px)`}>
            {numero}
          </span>
        {/each}
      </div>
      {#if error?.codigo === materiaSeleccionada.codigo}
        <p id="calificacion-error" role="alert" class="mt-2 text-sm text-amber-400">
          {error.mensaje}
        </p>
      {/if}
    </div>
  {:else}
    <div>Hacé click en una materia para ver sus detalles.</div>
  {/if}
</div>

<style>
  .calificacion-slider {
    position: relative;
    height: 32px;
  }

  .calificacion-carril {
    position: absolute;
    inset: 7px 12px;
    border-radius: 999px;
    background: var(--color-zinc-700);
    box-shadow: 0 0 0 1px rgb(255 255 255 / 15%);
  }

  .calificacion-slider.bloqueada .calificacion-carril::before {
    display: none;
  }

  .calificacion-carril::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--slider-bg);
    clip-path: inset(0 calc(100% - var(--progreso)) 0 0 round 999px);
  }

  .calificacion-input {
    position: relative;
    display: block;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  .calificacion-input[aria-disabled="true"] {
    cursor: not-allowed;
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
  }

  .calificacion-input::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border: 0;
    background: transparent;
  }

  .calificacion-input:focus-visible {
    outline: none;
  }

  .calificacion-slider:has(.calificacion-input:focus-visible) .calificacion-carril::after {
    content: "";
    position: absolute;
    inset: -6px;
    border: 2px solid var(--slider-bg);
    border-radius: 15px;
    pointer-events: none;
  }

  .calificacion-marcas {
    position: relative;
    height: 16px;
  }

  .calificacion-marcas span {
    position: absolute;
    transform: translateX(-50%);
  }

  .calificacion-thumb {
    position: absolute;
    top: 50%;
    display: flex;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%);
    color: var(--slider-fg);
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgb(0 0 0 / 40%));
  }

  .calificacion-thumb :global(svg > path:first-child) {
    fill: var(--slider-bg);
    fill-opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .calificacion-carril::before {
      transition: background-color 200ms ease;
    }

    .calificacion-carril::after {
      transition: border-color 200ms ease;
    }

    .calificacion-thumb {
      transition: color 200ms ease;
    }

    .calificacion-thumb :global(svg > path:first-child) {
      transition: fill 200ms ease;
    }
  }
</style>
