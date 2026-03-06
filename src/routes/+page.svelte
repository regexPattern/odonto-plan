<script lang="ts">
  import { Background, SvelteFlow, type NodeTypes } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { onMount } from "svelte";
  import { PLAN } from "$lib/data";
  import { SelectedMateria, AnioNode, MateriaNode } from "$lib/flow/components";
  import { rawEdges, rawNodes } from "$lib/flow/data";

  const nodeTypes: NodeTypes = {
    anio: AnioNode,
    materia: MateriaNode,
  };

  const STORAGE_KEY = "odonto-plan:calificaciones";

  let nodes = $state.raw(rawNodes);
  let edges = $state.raw(rawEdges);

  const materiasByCodigo = new Map(
    PLAN.anios.flatMap((anio) =>
      anio.materias.map((materia) => [materia.codigo, materia] as const),
    ),
  );

  let codigoSeleccionada = $state<string | null>(null);
  let calificaciones = $state<Record<string, number>>({});

  const materiaSeleccionada = $derived.by(() => {
    if (!codigoSeleccionada) {
      return null;
    }

    const materia = materiasByCodigo.get(codigoSeleccionada);
    if (!materia) {
      return null;
    }

    return {
      ...materia,
      calificacion: calificaciones[codigoSeleccionada] ?? null,
    };
  });

  const tieneCalificacion = (
    materiaId: string,
    calificaciones: Record<string, number>,
  ) => typeof calificaciones[materiaId] === "number";

  const materiaDesbloqueada = (
    materiaId: string,
    notas: Record<string, number>,
  ) => {
    const correlativas = PLAN.correlatividades[materiaId] ?? [];
    return correlativas.every((correlativa) =>
      tieneCalificacion(correlativa, notas),
    );
  };

  const getMateriaStatus = (
    codigoMateria: string,
    notas: Record<string, number>,
  ) => {
    if (tieneCalificacion(codigoMateria, notas)) {
      return "aprobada";
    } else if (materiaDesbloqueada(codigoMateria, notas)) {
      return "desbloqueada";
    } else {
      return "bloqueada";
    }
  };

  const aplicarStateANodes = (calificaciones: Record<string, number>) => {
    const nodesConStatus = nodes.map((node) => {
      if (node.type !== "materia") {
        return node;
      }

      const status = getMateriaStatus(node.id, calificaciones);

      return {
        ...node,
        data: {
          ...node.data,
          status,
        },
      };
    });

    nodes = nodesConStatus as typeof nodes;
  };

  const guardarCalificaciones = (notas: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  };

  const setCalificacion = (materiaId: string, calificacion: number | null) => {
    const nuevasCalificaciones = { ...calificaciones };

    if (calificacion === null) {
      delete nuevasCalificaciones[materiaId];
    } else {
      nuevasCalificaciones[materiaId] = calificacion;
    }

    calificaciones = nuevasCalificaciones;
    guardarCalificaciones(nuevasCalificaciones);
    aplicarStateANodes(nuevasCalificaciones);
  };

  const clearSelection = () => {
    codigoSeleccionada = null;
  };

  const handleNodeClick = ({ node }: { node: (typeof nodes)[number] }) => {
    if (node.type !== "materia") {
      return;
    }

    codigoSeleccionada = codigoSeleccionada === node.id ? null : node.id;
  };

  onMount(() => {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    if (!guardadas) {
      aplicarStateANodes({});
      return;
    }

    try {
      const parsed = JSON.parse(guardadas) as Record<string, unknown>;
      const loaded: Record<string, number> = {};

      for (const [materiaId, value] of Object.entries(parsed)) {
        if (typeof value === "number" && value >= 4 && value <= 10) {
          loaded[materiaId] = value;
        }
      }

      calificaciones = loaded;
      aplicarStateANodes(loaded);
    } catch {
      calificaciones = {};
      aplicarStateANodes({});
    }
  });
</script>

<div style:width="100vw" style:height="100vh">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    fitView
    edgesFocusable={false}
    onnodeclick={handleNodeClick}
    onpaneclick={clearSelection}
  >
    <SelectedMateria
      materia={materiaSeleccionada}
      onCalificacionChange={setCalificacion}
    />
    <Background />
  </SvelteFlow>
</div>
