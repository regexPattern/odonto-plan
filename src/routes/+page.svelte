<script lang="ts">
  import { Background, SvelteFlow, type NodeTypes } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { onMount } from "svelte";
  import { PLAN } from "$lib/data";
  import {
    SelectedMateria,
    AnioNode,
    MateriaNode,
    ProgresoCarrera,
  } from "$lib/flow/components";
  import { rawEdges, rawNodes, type MateriaNodeType } from "$lib/flow/data";

  const nodeTypes: NodeTypes = {
    anio: AnioNode,
    materia: MateriaNode,
  };

  const STORAGE_KEY = "odonto-plan:calificaciones";

  let nodes = $state.raw(rawNodes);
  let edges = $state.raw(rawEdges);

  const asMateriaNode = (
    node: (typeof nodes)[number],
  ): MateriaNodeType | null =>
    node.type === "materia" ? (node as MateriaNodeType) : null;

  const materiasByCodigo = new Map(
    PLAN.anios.flatMap((anio) =>
      anio.materias.map((materia) => [materia.codigo, materia] as const),
    ),
  );

  const totalMaterias = PLAN.anios.reduce(
    (acc, anio) => acc + anio.materias.length,
    0,
  );

  let codigoSeleccionada = $state<string | null>(null);

  const getCalificacionesFromNodes = (
    currentNodes: typeof nodes,
  ): Record<string, number> => {
    const notas: Record<string, number> = {};

    for (const node of currentNodes) {
      const materiaNode = asMateriaNode(node);
      if (!materiaNode) {
        continue;
      }

      if (typeof materiaNode.data.calificacion === "number") {
        notas[materiaNode.id] = materiaNode.data.calificacion;
      }
    }

    return notas;
  };

  const materiaSeleccionada = $derived.by(() => {
    if (!codigoSeleccionada) {
      return null;
    }

    const materia = materiasByCodigo.get(codigoSeleccionada);
    if (!materia) {
      return null;
    }

    const nodoSeleccionado = nodes.find(
      (node) => node.id === codigoSeleccionada,
    );
    const nodoMateriaSeleccionada =
      nodoSeleccionado && asMateriaNode(nodoSeleccionado);

    return {
      ...materia,
      calificacion: nodoMateriaSeleccionada?.data.calificacion ?? null,
    };
  });

  const resumenGeneral = $derived.by(() => {
    let aprobadas = 0;
    let sumaCalificaciones = 0;

    for (const node of nodes) {
      const materiaNode = asMateriaNode(node);
      if (!materiaNode || typeof materiaNode.data.calificacion !== "number") {
        continue;
      }

      aprobadas += 1;
      sumaCalificaciones += materiaNode.data.calificacion;
    }

    return {
      aprobadas,
      pendientes: totalMaterias - aprobadas,
      promedio: aprobadas ? sumaCalificaciones / aprobadas : null,
    };
  });

  const tieneCalificacion = (
    materiaId: string,
    notas: Record<string, number>,
  ) => typeof notas[materiaId] === "number";

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

  const aplicarStateANodes = (currentNodes: typeof nodes) => {
    const calificaciones = getCalificacionesFromNodes(currentNodes);

    const nodesConStatus = currentNodes.map((node) => {
      const materiaNode = asMateriaNode(node);
      if (!materiaNode) {
        return node;
      }

      const status = getMateriaStatus(materiaNode.id, calificaciones);

      return {
        ...materiaNode,
        data: {
          ...materiaNode.data,
          status,
        },
      };
    });

    return nodesConStatus as typeof nodes;
  };

  const guardarCalificaciones = (notas: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  };

  const setCalificacion = (materiaId: string, calificacion: number | null) => {
    const nodesConCalificacion = nodes.map((node) => {
      const materiaNode = asMateriaNode(node);
      if (!materiaNode || materiaNode.id !== materiaId) {
        return node;
      }

      return {
        ...materiaNode,
        data: {
          ...materiaNode.data,
          calificacion,
        },
      };
    }) as typeof nodes;

    const nodesConEstado = aplicarStateANodes(nodesConCalificacion);
    nodes = nodesConEstado;
    guardarCalificaciones(getCalificacionesFromNodes(nodesConEstado));
  };

  const clearSelection = () => {
    codigoSeleccionada = null;
    aplicarEdgeFocus(null);
  };

  const aplicarEdgeFocus = (materiaId: string | null) => {
    const edgesActivos = new Set(
      materiaId
        ? rawEdges
            .filter(
              (edge) => edge.source === materiaId || edge.target === materiaId,
            )
            .map((edge) => edge.id)
        : [],
    );

    edges = rawEdges.map((edge) => {
      const estaActivo = edgesActivos.has(edge.id);

      return {
        ...edge,
        style: estaActivo
          ? "stroke:#62748e;stroke-width:2;opacity:1"
          : "stroke:#94a3b8;stroke-width:1;opacity:0.35",
      };
    }) as typeof edges;
  };

  const handleNodeClick = ({ node }: { node: (typeof nodes)[number] }) => {
    if (node.type === "anio") {
      clearSelection();
      return;
    }

    if (node.type !== "materia") {
      return;
    }

    const nextSelection = codigoSeleccionada === node.id ? null : node.id;
    codigoSeleccionada = nextSelection;
    aplicarEdgeFocus(nextSelection);
  };

  onMount(() => {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    if (!guardadas) {
      nodes = aplicarStateANodes(nodes);
      aplicarEdgeFocus(null);
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

      const nodesConCalificaciones = nodes.map((node) => {
        const materiaNode = asMateriaNode(node);
        if (!materiaNode) {
          return node;
        }

        return {
          ...materiaNode,
          data: {
            ...materiaNode.data,
            calificacion: loaded[materiaNode.id] ?? null,
          },
        };
      }) as typeof nodes;

      nodes = aplicarStateANodes(nodesConCalificaciones);
      aplicarEdgeFocus(null);
    } catch {
      const nodesSinCalificaciones = nodes.map((node) => {
        const materiaNode = asMateriaNode(node);
        if (!materiaNode) {
          return node;
        }

        return {
          ...materiaNode,
          data: {
            ...materiaNode.data,
            calificacion: null,
          },
        };
      }) as typeof nodes;

      nodes = aplicarStateANodes(nodesSinCalificaciones);
      aplicarEdgeFocus(null);
    }
  });
</script>

<div style:width="100vw" style:height="100vh">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    nodesDraggable={false}
    edgesFocusable={false}
    onnodeclick={handleNodeClick}
    onpaneclick={clearSelection}
    initialViewport={{ x: 0, y: 140, zoom: 0.75 }}
    minZoom={0.4}
    maxZoom={1.8}
  >
    <ProgresoCarrera
      materiasAprobadas={resumenGeneral.aprobadas}
      materiasPendientes={resumenGeneral.pendientes}
      promedioGeneral={resumenGeneral.promedio}
    />
    <SelectedMateria
      materia={materiaSeleccionada}
      onCalificacionChange={setCalificacion}
    />
    <Background />
  </SvelteFlow>
</div>
