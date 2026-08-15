<script lang="ts">
  import graph from "#lib/graph/state.svelte.js";

  let materia = $derived(graph.materiaSeleccionada);

  const actualizarCalificacion = (event: Event) => {
    if (!materia) {
      return;
    }

    const input = event.currentTarget as HTMLInputElement;
    const calificacion = input.value === "" ? null : input.valueAsNumber;

    if (calificacion === null || (calificacion >= 4 && calificacion <= 10)) {
      graph.actualizarCalificacion(materia.codigo, calificacion);
    }
  };
</script>

<div class="w-72 border p-3">
  {#if materia}
    <h1>{materia.nombre}</h1>
    <div class="py-3">
      <div><span class="font-medium">Duración:</span> {materia.duracion}</div>
      <div><span class="font-medium">Carga horaria:</span> {materia.horas}</div>
    </div>
    <div>
      <input
        type="number"
        min="4"
        max="10"
        step="1"
        value={materia.calificacion ?? ""}
        placeholder="Sin aprobar"
        aria-label={`Calificación de ${materia.nombre}`}
        oninput={actualizarCalificacion}
        class="w-full rounded-full border px-3 py-2"
      />
    </div>
  {:else}
    <div>Hacé click en una materia para ver sus detalles.</div>
  {/if}
</div>
