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
    class="w-[300px] divide-y-2 divide-slate-300 border-2 border-slate-300 bg-slate-100/50 backdrop-blur-lg *:p-4"
  >
    <div class="font-semibold">Materia seleccionada</div>
    {#if materia}
      <div class="space-y-4">
        <h2 class="font-semibold">{materia.nombre}</h2>
        <div>
          <p><span class="font-medium"> • Duración:</span> {materia.duracion}</p>
          <p><span class="font-medium"> • Carga horaria:</span> {materia.horas}</p>
        </div>
      </div>
      <label for="calificacion-input" class="block space-y-2">
        <span class="font-semibold block">Calificación (4-10):</span>
        <input
          id="calificacion-input"
          type="number"
          min="4"
          max="10"
          step="1"
          placeholder="Sin aprobar"
          value={materia.calificacion ?? ""}
          onchange={handleCalificacionInput}
          class="border-2 w-full px-2 py-1 border-slate-300 bg-white"
        />
      </label>
    {:else}
      <p>Hacé click en una materia para ver su detalle.</p>
    {/if}
  </section>
</Panel>
