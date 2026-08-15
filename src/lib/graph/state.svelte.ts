import { rawEdges, rawNodes } from "./layout.js";
import { PLAN } from "#lib/plan/index.js";
import type { MateriaNodeData } from ".";

class State {
  nodes = $state.raw(rawNodes);
  edges = $state.raw(rawEdges);
  materiaSeleccionada = $state<MateriaNodeData | null>(null);

  seleccionarMateria = (materia: MateriaNodeData) => {
    this.materiaSeleccionada = materia;
    this.marcarEdgesActivos(materia.codigo);
  };

  deseleccionarMateria = () => {
    this.materiaSeleccionada = null;
    this.marcarEdgesActivos(null);
  };

  actualizarCalificacion = (codigoMateria: string, calificacion: number | null) => {
    const aprobadas = new Set(
      this.nodes
        .filter((node) => node.type === "materia")
        .filter((node) =>
          node.data.codigo === codigoMateria
            ? calificacion !== null
            : node.data.calificacion !== null,
        )
        .map((node) => node.data.codigo),
    );

    this.nodes = this.nodes.map((node) => {
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

    const node = this.nodes.find(
      (n) => n.type === "materia" && n.data.codigo === this.materiaSeleccionada?.codigo,
    );
    this.materiaSeleccionada = node?.type === "materia" ? node.data : null;
  };

  private marcarEdgesActivos(codigo: string | null) {
    this.edges = this.edges.map((e) => ({
      ...e,
      class:
        codigo !== null && (e.source === codigo || e.target === codigo) ? "edge-activo" : undefined,
    }));
  }
}

export default new State();
