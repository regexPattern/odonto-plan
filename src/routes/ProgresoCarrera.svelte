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
  const electivasAprobadas = $derived(
    Math.min(
      graph.materiasAprobadas.filter(({ codigo }) => codigosElectivas.has(codigo)).length,
      ELECTIVAS_REQUERIDAS,
    ),
  );
  const obligatoriasAprobadas = $derived(
    graph.materiasAprobadas.filter(({ codigo }) => !codigosElectivas.has(codigo)).length,
  );
  const aprobadas = $derived(obligatoriasAprobadas + electivasAprobadas);
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

<div tabindex="-1" class="group relative w-[min(23rem,calc(100vw-1rem))] outline-none">
  <div
    id="detalle-progreso"
    role="tooltip"
    class="pointer-events-none absolute inset-x-0 bottom-full mb-2 origin-bottom transform-gpu translate-y-2 scale-98 border border-borde bg-panel flex justify-evenly px-3 py-3 gap-3 text-center text-sm opacity-0 backdrop-blur-xl motion-safe:transition-[opacity,translate,scale] motion-safe:duration-180 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
  >
    <div>
      <p class="text-xl font-medium tabular-nums">
        <span class="text-bg-aprobada">{obligatoriasAprobadas}</span> de {totalObligatorias}
      </p>
      <p>obligatorias<br />aprobadas</p>
    </div>
    <div>
      <p class="text-xl font-medium tabular-nums">
        <span class="text-bg-aprobada">{electivasAprobadas}</span> de {ELECTIVAS_REQUERIDAS}
      </p>
      <p>electivas<br />aprobadas</p>
    </div>
  </div>
  <div
    class="flex items-center gap-2 rounded-full border border-borde bg-panel py-1 pr-4 pl-[11px] backdrop-blur-xl"
  >
    <div
      class="relative h-8 flex-1"
      role="progressbar"
      aria-label="Progreso de la carrera"
      aria-valuemin="0"
      aria-valuemax={totalMaterias}
      aria-valuenow={aprobadas}
      aria-valuetext={`${aprobadas} de ${totalMaterias} materias aprobadas (${porcentaje}%)`}
      style={`--p: ${progreso / 100}`}
    >
      <div
        class="absolute inset-x-0 inset-y-[7px] overflow-hidden rounded-full bg-pista ring-1 ring-pista-anillo"
        aria-hidden="true"
      >
        <div
          class="absolute inset-0 bg-bg-aprobada [clip-path:inset(0_calc(100%-(100%-24px)*var(--p)-6px)_0_0)]"
        ></div>
      </div>
      <span
        class="pointer-events-none absolute top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 text-fg-aprobada drop-shadow-[0_1px_2px_rgb(0_0_0/0.4)] [&_svg>path:first-child]:fill-bg-aprobada [&_svg>path:first-child]:[fill-opacity:1]"
        style:left="calc(12px + (100% - 24px) * var(--p))"
        aria-hidden="true"
      >
        <Tooth size={24} />
      </span>
    </div>
    <button
      type="button"
      class="cursor-help whitespace-nowrap text-sm font-medium"
      aria-describedby="detalle-progreso"
    >
      <span class="font-semibold tabular-nums text-bg-aprobada">{porcentaje}%</span> completado
    </button>
  </div>
</div>

