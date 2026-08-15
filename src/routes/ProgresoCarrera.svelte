<script lang="ts">
  import graph from "#lib/graph/state.svelte.js";

  const totalMaterias = $derived.by(() =>
    graph.nodes.filter((n) => n.type === "materia").reduce((acc) => acc + 1, 0),
  );
</script>

<div>
  {totalMaterias}
</div>
