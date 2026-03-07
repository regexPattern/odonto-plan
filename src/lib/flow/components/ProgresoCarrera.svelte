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
  <section class="blurred p-3">
    <ol class="ml-1.5 list-outside list-disc space-y-1.5 pl-2">
      <li>
        Materias aprobadas: {materiasAprobadas} de {totalMaterias} ({porcentajeAprobadas.toFixed(
          0,
        )}%)
      </li>
      <li>
        <span>Promedio:</span>
        {#if promedioGeneral === null}
          Sin calificaciones
        {:else}
          {promedioGeneral.toFixed(2)}
        {/if}
      </li>
    </ol>
  </section>
</Panel>
