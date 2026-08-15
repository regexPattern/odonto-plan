<script lang="ts">
  import graph from "#lib/graph/state.svelte.js";

  const materia = $derived(graph.materiaSeleccionada);
</script>

{#if materia}
  <div>{materia.nombre}</div>
{/if}
