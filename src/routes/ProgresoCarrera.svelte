<script lang="ts">
  import { Tooth } from "@withicons/svelte/kawaii";
  import graph from "#lib/graph/state.svelte.js";

  const totalMaterias = $derived(graph.nodes.filter((n) => n.type === "materia").length);
  const aprobadas = $derived(graph.materiasAprobadas.length);
  const progreso = $derived(totalMaterias > 0 ? (aprobadas / totalMaterias) * 100 : 0);
  const porcentaje = $derived(Math.round(progreso));

  let completa: boolean | null = null;

  $effect(() => {
    const ahora = totalMaterias > 0 && aprobadas >= totalMaterias;
    // Solo al pasar a 100% (no al cargar una carrera ya completa).
    if (ahora && completa === false) void lanzarConfetti();
    completa = ahora;
  });

  async function lanzarConfetti() {
    const { default: confetti } = await import("canvas-confetti");
    // Lluvia suave que cae desde todo el ancho de la pantalla.
    const fin = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 100,
        startVelocity: 25,
        gravity: 1.1,
        drift: (Math.random() - 0.5) * 0.8,
        ticks: 250,
        scalar: 0.9,
        origin: { x: Math.random(), y: -0.05 },
      });
      // Costados: pocas partículas y velocidad moderada, para que no sea un chorro.
      if (Math.random() < 0.5) {
        const izquierda = Math.random() < 0.5;
        confetti({
          particleCount: 2,
          angle: izquierda ? 60 : 120,
          spread: 60,
          startVelocity: 30,
          gravity: 1.1,
          ticks: 250,
          scalar: 0.9,
          origin: { x: izquierda ? 0 : 1, y: 0.4 + Math.random() * 0.3 },
        });
      }
      // Abajo: sube suave desde el borde inferior y vuelve a caer.
      if (Math.random() < 0.6) {
        confetti({
          particleCount: 2,
          angle: 90,
          spread: 120,
          startVelocity: 28,
          gravity: 1.1,
          ticks: 250,
          scalar: 0.9,
          origin: { x: Math.random(), y: 1.05 },
        });
      }
      if (Date.now() < fin) requestAnimationFrame(frame);
    };
    frame();
  }
</script>

<div
  class="progreso-panel w-[min(23rem,calc(100vw-2rem))] border border-zinc-700/70 bg-[#141414]/50 px-5 py-2 backdrop-blur-xl"
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
    <span><span class="tabular-nums">{aprobadas} de {totalMaterias}</span> materias aprobadas</span>
  </div>
</div>

<style>
  .progreso-panel {
    border-radius: 0;
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
