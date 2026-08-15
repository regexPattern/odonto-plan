import type { NodeTypes } from "@xyflow/svelte";
import { AnioNode, MateriaNode } from "./components/index.js";
import { rawEdges, rawNodes } from "./layout.js";
import { PLAN } from "#lib/plan/index.js";
import type { MateriaNodeData } from ".";

export const nodeTypes: NodeTypes = {
  anio: AnioNode,
  materia: MateriaNode,
};

let nodes = $state.raw(rawNodes);
let edges = $state.raw(rawEdges);

let materiaSeleccionada: MateriaNodeData | null = $state(null);

const marcarEdgesActivos = (codigo: string | null) => {
  edges = edges.map((edge) => ({
    ...edge,
    class:
      codigo !== null && (edge.source === codigo || edge.target === codigo)
        ? "edge-activo"
        : undefined,
  }));
};

export default {
  get nodes() {
    return nodes;
  },
  set nodes(value) {
    nodes = value;
  },
  get edges() {
    return edges;
  },
  set edges(value) {
    edges = value;
  },
  get materiaSeleccionada() {
    return materiaSeleccionada;
  },
  seleccionarMateria(materia: MateriaNodeData) {
    materiaSeleccionada = materia;
    marcarEdgesActivos(materia.codigo);
  },
  deseleccionarMateria() {
    materiaSeleccionada = null;
    marcarEdgesActivos(null);
  },
  actualizarCalificacion(codigoMateria: string, calificacion: number | null) {
    const aprobadas = new Set(
      nodes
        .filter((node) => node.type === "materia")
        .filter((node) =>
          node.data.codigo === codigoMateria ? calificacion !== null : node.data.calificacion !== null,
        )
        .map((node) => node.data.codigo),
    );

    nodes = nodes.map((node) => {
      if (node.type !== "materia") return node;

      const nota = node.data.codigo === codigoMateria ? calificacion : node.data.calificacion;
      const correlativas = PLAN.correlatividades[node.data.codigo] ?? [];
      const estado =
        nota !== null
          ? "aprobada"
          : correlativas.every((correlativa) => aprobadas.has(correlativa))
            ? "desbloqueada"
            : "bloqueada";

      return { ...node, data: { ...node.data, calificacion: nota, estado } };
    });

    const node = nodes.find(
      (n) => n.type === "materia" && n.data.codigo === materiaSeleccionada?.codigo,
    );
    materiaSeleccionada = node?.type === "materia" ? node.data : null;
  },
};
