<script lang="ts">
  import { motion } from "@withicons/motion/runtime";
  import ArrowRight from "@withicons/svelte/kawaii/icons/arrow-right";
  import PartyPopper from "@withicons/svelte/kawaii/icons/party-popper";
  import Tooth from "@withicons/svelte/kawaii/icons/tooth";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { guardarPersistido, leerPersistido } from "#lib/storage.js";

  // Mantener sincronizada con la clave del script de src/app.html.
  const INTRO_VISTA_STORAGE_KEY = "odonto-plan:intro-vista";

  // Se prerenderiza abierta (también la ve Google); app.html la oculta antes del primer paint
  // si ya fue vista, y acá se quita del DOM al hidratar.
  let { onlista }: { onlista: () => void } = $props();
  let cerrada = $state(false);
  let diente = $state<HTMLElement>();
  let fiesta = $state<HTMLElement>();
  let botonEmpezar = $state<HTMLButtonElement>();

  // Un solo movimiento a la vez: aplicar otro reemplaza al anterior.
  const mover = (preset: "bounce" | "jelly") =>
    diente && motion(diente, "tooth", { trigger: "once", preset });

  onMount(() => {
    try {
      if (leerPersistido(INTRO_VISTA_STORAGE_KEY) !== null) {
        cerrada = true;
        onlista();
        return;
      }
    } catch {
      // Sin acceso a localStorage: se muestra siempre.
    }
    mover("bounce");
    botonEmpezar?.focus({ preventScroll: true });
    // Animación por defecto del party popper cuando el texto ya apareció.
    const t = setTimeout(
      () => fiesta && motion(fiesta, "party-popper", { trigger: "once" }),
      1700,
    );
    return () => clearTimeout(t);
  });

  // Salida sutil: el fondo se desvanece mientras todo se achica apenas.
  const salida = (_nodo: Element) => ({
    duration: 450,
    easing: cubicOut,
    css: (t: number) => `opacity: ${t}; transform: scale(${0.97 + 0.03 * t});`,
  });

  const cerrar = () => {
    cerrada = true;
    try {
      guardarPersistido(INTRO_VISTA_STORAGE_KEY, "1");
    } catch {
      // Sin acceso a localStorage: no se recuerda.
    }
  };
</script>

<svelte:window onkeydown={(e) => !cerrada && e.key === "Escape" && cerrar()} />

{#if !cerrada}
  <!-- Mismo fondo sólido que el canvas; cubre toda la vista principal. -->
  <div
    id="intro-app"
    out:salida
    onoutroend={onlista}
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white p-4 text-texto dark:bg-[#141414]"
  >
    <div
      role="dialog"
      aria-labelledby="intro-titulo"
      class="my-auto flex w-full max-w-md flex-col items-center text-center text-sm"
    >
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        onclick={() => mover("jelly")}
        class="intro-icono block cursor-pointer"
      >
        <span bind:this={diente} class="muela flex"><Tooth size={96} strokeWidth={1.4} /></span>
      </button>
      <div class="intro-texto grid">
        <div class="-mx-1.5 -mb-1.5 min-h-0 overflow-hidden px-1.5 pb-1.5">
          <div class="globo relative mt-6 superficie-fuerte p-5 text-left sm:p-6">
            <p class="flex items-center gap-1.5 text-base text-texto-suave">
              <span>
                ¡Hola! Bienvenido/a a
                <span class="font-medium tracking-tight text-texto">OdontoPlan</span>
              </span>
              <span bind:this={fiesta} class="flex shrink-0 text-amber-500"
                ><PartyPopper size={28} aria-hidden="true" /></span
              >
            </p>
            <h1 id="intro-titulo" class="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Plan de estudios y correlativas de Odontología UBA
            </h1>
            <div class="mt-3 space-y-3 leading-relaxed text-texto-suave">
              <p>
                Seguí tu progreso en la carrera de Odontología de la Facultad de Odontología de la
                Universidad de Buenos Aires (FOUBA).
              </p>
              <p>
                Explorá las materias desde el CBC, consultá sus correlativas y marcá las que ya
                aprobaste.
              </p>
              <p>Tu progreso se guarda en este navegador.</p>
            </div>
          </div>
          <button
            bind:this={botonEmpezar}
            type="button"
            onclick={cerrar}
            class="group mt-5 inline-flex items-center gap-2 border border-borde-fuerte bg-transparent px-5 py-2 font-medium text-texto hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Empezar
            <ArrowRight size={18} aria-hidden="true" class="intro-flecha" />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Punta del globo hacia la muela: triángulo con borde (capa de borde + capa de relleno). */
  .globo::before,
  .globo::after {
    content: "";
    position: absolute;
    left: 50%;
    translate: -50% 0;
    clip-path: polygon(0 100%, 50% 0, 100% 100%);
  }
  .globo::before {
    bottom: 100%;
    width: 18px;
    height: 10px;
    margin-bottom: 0;
    background: var(--color-borde);
  }
  .globo::after {
    bottom: calc(100% - 1px);
    width: 16px;
    height: 9px;
    background: var(--color-panel-fuerte);
  }

  /* Primero sólo la muela, grande y centrada; tras el rebote se acomoda y aparece el texto. */
  @media (prefers-reduced-motion: no-preference) {
    .intro-icono {
      animation: intro-icono 700ms cubic-bezier(0.65, 0, 0.35, 1) 1200ms both;
    }
    .intro-texto {
      animation: intro-texto 700ms cubic-bezier(0.65, 0, 0.35, 1) 1200ms both;
    }
    .intro-texto > div {
      animation: intro-fade 500ms ease-out 1600ms both;
    }
    :global(.intro-flecha) {
      animation: intro-flecha 1.2s ease-in-out 2300ms infinite;
    }
  }
  @keyframes intro-icono {
    from {
      transform: scale(2.6);
    }
    to {
      transform: scale(1);
    }
  }
  @keyframes intro-texto {
    from {
      grid-template-rows: 0fr;
    }
    to {
      grid-template-rows: 1fr;
    }
  }
  @keyframes intro-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes intro-flecha {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(5px);
    }
  }

  /* Estilo "Toothpaste stripe" de kawaii: contorno y cara azul marino, cuerpo blanco, mejillas rojas. */
  .muela {
    color: #0a1e3a;
    --with-kawaii-fill-2: #f7faff;
    --with-kawaii-face: #0a1e3a;
    --with-kawaii-blush: #e5484d;
    --with-kawaii-shine: #ffffff;
  }
</style>
