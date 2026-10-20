<script lang="ts">
  import { Tooth } from "@withicons/svelte/kawaii";
  import graph from "#lib/graph/state.svelte.js";
  import { PLAN } from "#lib/plan/index.js";

  // Solo hace falta aprobar 2 electivas.
  const ELECTIVAS_REQUERIDAS = 2;
  const codigosElectivas = new Set(
    PLAN.anios.flatMap(({ materias }) =>
      materias.filter((m) => m.cuatriInicial === null).map((m) => m.codigo),
    ),
  );
  const totalObligatorias = PLAN.anios.reduce(
    (n, { materias }) => n + materias.filter((m) => m.cuatriInicial !== null).length,
    0,
  );

  const totalMaterias = totalObligatorias + ELECTIVAS_REQUERIDAS;
  const aprobadas = $derived.by(() => {
    const todas = graph.materiasAprobadas;
    const electivas = todas.filter(({ codigo }) => codigosElectivas.has(codigo)).length;
    return todas.length - electivas + Math.min(electivas, ELECTIVAS_REQUERIDAS);
  });
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
  class="w-[min(23rem,calc(100vw-1rem))] border border-zinc-700/70 bg-[#141414]/50 px-3 py-2 backdrop-blur-xl sm:px-5"
>
  <div
    class="relative h-10"
    role="progressbar"
    aria-label="Progreso de la carrera"
    aria-valuemin="0"
    aria-valuemax={totalMaterias}
    aria-valuenow={aprobadas}
    aria-valuetext={`${aprobadas} de ${totalMaterias} materias aprobadas (${porcentaje}%)`}
    style={`--progreso: ${progreso}%`}
  >
    <div
      class="absolute inset-[7px] rounded-full bg-zinc-700 ring-1 ring-white/15"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 rounded-full bg-bg-aprobada [clip-path:inset(0_calc(100%-var(--progreso))_0_0_round_999px)] motion-safe:transition-[clip-path] motion-safe:duration-300"
      ></div>
    </div>
    <span
      class="pointer-events-none absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 text-fg-aprobada drop-shadow-[0_1px_2px_rgb(0_0_0/0.4)] motion-safe:transition-[left] motion-safe:duration-300 [&>svg>path:first-child]:fill-bg-aprobada [&>svg>path:first-child]:[fill-opacity:1]"
      style:left={`calc(${progreso}% + ${7 - progreso * 0.14}px)`}
      aria-hidden="true"><Tooth size={32} /></span
    >
    <span
      class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-zinc-50 tabular-nums"
      aria-hidden="true">{porcentaje}% completado</span
    >
  </div>
  <p class="mt-1 text-center text-sm">
    <span class="tabular-nums">{aprobadas} de {totalMaterias}</span> materias aprobadas
  </p>
</div>
