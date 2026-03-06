<script lang="ts">
  import { Panel } from "@xyflow/svelte";

  interface Props {
    materiasAprobadas?: number;
    materiasPendientes?: number;
    promedioGeneral?: number | null;
  }

  let {
    materiasAprobadas = 0,
    materiasPendientes = 0,
    promedioGeneral = null,
  }: Props = $props();

  const totalMaterias = $derived(materiasAprobadas + materiasPendientes);
  const porcentajeAprobadas = $derived(
    totalMaterias > 0 ? (materiasAprobadas / totalMaterias) * 100 : 0,
  );
</script>

<Panel position="top-left">
  <section
    class="space-y-1.5 border-2 border-slate-300 bg-slate-100/50 p-3 text-sm backdrop-blur-lg"
  >
    <p>
      <span> • Materias aprobadas:</span>
      {materiasAprobadas} de {totalMaterias} ({porcentajeAprobadas.toFixed(0)}%)
    </p>
    <p>
      <span> • Promedio:</span>
      {#if promedioGeneral === null}
        Sin calificaciones
      {:else}
        {promedioGeneral.toFixed(2)}
      {/if}
    </p>
  </section>
</Panel>
