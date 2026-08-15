<script lang="ts">
  import graph from "#lib/graph/state.svelte.js";

  const materia = $derived(graph.materiaSeleccionada);

  function actualizarCalificacion(event: Event) {
    if (!materia) return;

    const input = event.currentTarget as HTMLInputElement;
    const calificacion = input.value === "" ? null : input.valueAsNumber;

    if (calificacion === null || (calificacion >= 4 && calificacion <= 10)) {
      graph.actualizarCalificacion(materia.codigo, calificacion);
    }
  }
</script>

{#if materia}
  <div>{materia.nombre}</div>
  <input
    type="number"
    min="4"
    max="10"
    step="1"
    value={materia.calificacion ?? ""}
    placeholder="Sin aprobar"
    aria-label={`Calificación de ${materia.nombre}`}
    oninput={actualizarCalificacion}
    class="border"
  />
{/if}
