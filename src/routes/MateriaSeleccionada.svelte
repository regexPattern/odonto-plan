<script lang="ts">
  import { esCalificacionAprobada } from "#lib/graph/index.js";
  import graph from "#lib/graph/state.svelte.js";
  import { guardarMateriasAprobadas } from "#lib/graph/storage.js";

  let materiaSeleccionada = $derived(graph.materiaSeleccionada);

  const handleInput = (event: Event) => {
    if (!materiaSeleccionada) return;

    const input = event.currentTarget as HTMLInputElement;
    const calificacion = input.value === "" ? null : input.valueAsNumber;
    if (calificacion !== null && !esCalificacionAprobada(calificacion)) return;

    const codigoMateria = materiaSeleccionada.codigo;
    const materiasAprobadas = graph.materiasAprobadas.filter(
      ({ codigo }) => codigo !== codigoMateria,
    );
    if (calificacion !== null) materiasAprobadas.push({ codigo: codigoMateria, calificacion });
    graph.materiasAprobadas = materiasAprobadas;
    guardarMateriasAprobadas(graph.materiasAprobadas);
  };
</script>

<div class="w-72 border border-zinc-800 bg-[#141414]/50 p-3 backdrop-blur-xl">
  {#if materiaSeleccionada}
    <h1 class="font-serif font-medium">{materiaSeleccionada.nombre}</h1>
    <div class="py-3">
      <div><span class="font-medium">Duración:</span> {materiaSeleccionada.duracion}</div>
      <div><span class="font-medium">Carga horaria:</span> {materiaSeleccionada.horas}</div>
    </div>
    <div>
      <input
        type="number"
        min="4"
        max="10"
        step="1"
        value={materiaSeleccionada.calificacion ?? ""}
        placeholder="Sin aprobar"
        aria-label={`Calificación de ${materiaSeleccionada.nombre}`}
        oninput={handleInput}
        class="w-full rounded-full border px-3 py-2"
      />
    </div>
  {:else}
    <div>Hacé click en una materia para ver sus detalles.</div>
  {/if}
</div>
