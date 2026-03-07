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
  <section class="blurred w-[300px]">
    {#if materia}
      <div class="divide-y-2 divide-slate-300 *:p-3 dark:divide-slate-700">
        <h2 class="text-center font-semibold">{materia.nombre}</h2>
        <div>
          <ol class="ml-1.5 list-outside list-disc space-y-1.5 pl-2">
            <li>
              <span class="font-semibold">Duración:</span>
              {materia.duracion}
            </li>
            <li>
              <span class="font-semibold">Carga horaria:</span>
              {materia.horas}
            </li>
          </ol>
        </div>
        <label for="calificacion-input" class="flex items-center gap-2">
          <span class="block font-semibold shrink-0">Calificación (4-10):</span>
          <input
            id="calificacion-input"
            type="number"
            min="4"
            max="10"
            step="1"
            placeholder="Sin aprobar"
            value={materia.calificacion ?? ""}
            onchange={handleCalificacionInput}
            class="w-full border-2 border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-gray-800"
          />
        </label>
      </div>
    {:else}
      <p class="p-3">Hacé click en una materia para ver su detalle.</p>
    {/if}
  </section>
</Panel>
