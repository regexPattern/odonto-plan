<script lang="ts">
  import type { Materia } from "$lib/data";
  import { Panel } from "@xyflow/svelte";

  type MateriaSeleccionada = Materia & {
    calificacion: number | null;
  };

  interface Props {
    materia?: MateriaSeleccionada | null;
    onCalificacionChange?: (
      codigo: string,
      calificacion: number | null,
    ) => void;
  }

  let { materia = null, onCalificacionChange = () => {} }: Props = $props();

  const handleCalificacionInput = (e: Event) => {
    if (!materia) {
      return;
    }

    const input = e.currentTarget as HTMLInputElement;
    const raw = input.value.trim();

    if (!raw) {
      onCalificacionChange(materia.codigo, null);
      return;
    }

    const parsed = Number(raw);

    if (!Number.isFinite(parsed) || parsed < 4 || parsed > 10) {
      return;
    }

    onCalificacionChange(materia.codigo, parsed);
  };
</script>

<Panel position="top-right">
  <section
    class="w-[300px] border-2 border-slate-300 bg-slate-100/50 text-sm backdrop-blur-lg"
  >
    {#if materia}
      <div class="divide-y-2 divide-slate-300 *:p-3">
        <h2 class="text-center font-medium">{materia.nombre}</h2>
        <div class="space-y-1.5">
          <p>
            <span> • Duración:</span>
            {materia.duracion}
          </p>
          <p>
            <span> • Carga horaria:</span>
            {materia.horas}
          </p>
        </div>
        <label for="calificacion-input" class="flex items-center gap-2">
          <span class="block shrink-0">Calificación (4-10):</span>
          <input
            id="calificacion-input"
            type="number"
            min="4"
            max="10"
            step="1"
            placeholder="Sin aprobar"
            value={materia.calificacion ?? ""}
            onchange={handleCalificacionInput}
            class="w-full border-2 border-slate-300 bg-white px-2 py-1"
          />
        </label>
      </div>
    {:else}
      <p class="p-3">Hacé click en una materia para ver su detalle.</p>
    {/if}
  </section>
</Panel>
