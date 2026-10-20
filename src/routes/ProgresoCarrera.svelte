<script lang="ts">
  import { Tooth } from "@withicons/svelte/kawaii";
  import graph from "#lib/graph/state.svelte.js";

  const totalMaterias = $derived(graph.nodes.filter((n) => n.type === "materia").length);
  const aprobadas = $derived(graph.materiasAprobadas.length);
  const progreso = $derived(totalMaterias > 0 ? (aprobadas / totalMaterias) * 100 : 0);
  const porcentaje = $derived(Math.round(progreso));
</script>

<div
  class="progreso-panel w-[min(23rem,calc(100vw-2rem))] border border-zinc-700/70 bg-[#141414]/50 p-2 backdrop-blur-xl"
>
  <div
    class="progreso-barra"
    role="progressbar"
    aria-label="Progreso de la carrera"
    aria-valuemin="0"
    aria-valuemax={totalMaterias}
    aria-valuenow={aprobadas}
    aria-valuetext={`${aprobadas} de ${totalMaterias} materias aprobadas (${porcentaje}%)`}
    style={`--progreso: ${progreso}%`}
  >
    <div class="progreso-carril" aria-hidden="true"></div>
    <span
      class="progreso-thumb"
      style:left={`calc(${progreso}% + ${7 - progreso * 0.14}px)`}
      aria-hidden="true"><Tooth size={32} /></span
    >
    <span class="progreso-porcentaje text-sm" aria-hidden="true">{porcentaje}% completado</span>
  </div>
  <div class="mt-1 flex flex-col items-center gap-1 text-center text-sm">
    <span
      ><span class="tabular-nums">{aprobadas} de {totalMaterias}</span> materias aprobadas</span
    >
    {#if totalMaterias > 0 && aprobadas === totalMaterias}
      <span class="text-fuchsia-300">¡Lo lograste!</span>
    {/if}
  </div>
</div>

<style>
  .progreso-panel {
    /* Radio del carril + separación superior + padding + borde, en las cuatro esquinas. */
    border-radius: calc(13px + 7px + 0.5rem + 1px);
  }

  .progreso-barra {
    position: relative;
    height: 40px;
  }

  .progreso-carril {
    position: absolute;
    inset: 7px;
    border-radius: 999px;
    background: var(--color-zinc-700);
    box-shadow: 0 0 0 1px rgb(255 255 255 / 15%);
  }

  .progreso-carril::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-bg-aprobada);
    clip-path: inset(0 calc(100% - var(--progreso)) 0 0 round 999px);
  }

  .progreso-thumb {
    position: absolute;
    top: 50%;
    display: flex;
    width: 32px;
    height: 32px;
    transform: translate(-50%, -50%);
    color: var(--color-fg-aprobada);
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgb(0 0 0 / 40%));
  }

  .progreso-porcentaje {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--color-zinc-50);
    pointer-events: none;
  }

  .progreso-thumb :global(svg > path:first-child) {
    fill: var(--color-bg-aprobada);
    fill-opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .progreso-carril::before {
      transition: clip-path 300ms ease;
    }

    .progreso-thumb {
      transition: left 300ms ease;
    }
  }
</style>
