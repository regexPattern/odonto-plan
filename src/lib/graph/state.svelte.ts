import { PLAN } from "#lib/plan/index.js";
import { esCalificacionAprobada, type MateriaAprobada, type MateriaNodeData } from ".";
import { rawEdges, rawNodes } from "./layout.js";

class GraphState {
  public nodes = $state.raw(rawNodes);
  public edges = $state.raw(rawEdges);
  private codigoMateriaSeleccionada = $state<string | null>(null);

  public materiaSeleccionada = $derived.by(() => {
    const node = this.nodes.find(
      (node) => node.type === "materia" && node.data.codigo === this.codigoMateriaSeleccionada,
    );
    return node?.type === "materia" ? node.data : null;
  });

  public seleccionarMateria(materia: MateriaNodeData) {
    this.codigoMateriaSeleccionada = materia.codigo;
    this.activarEdgesMateria(materia.codigo);
  }

  public deseleccionarMateria() {
    this.codigoMateriaSeleccionada = null;
    this.activarEdgesMateria(null);
  }

  public get materiasAprobadas(): MateriaAprobada[] {
    return this.nodes.flatMap(({ type, data }) =>
      type === "materia" && data.estado === "aprobada" && esCalificacionAprobada(data.calificacion)
        ? [{ codigo: data.codigo, calificacion: data.calificacion }]
        : [],
    );
  }

  public set materiasAprobadas(materiasAprobadas: readonly MateriaAprobada[]) {
    const codigosMaterias = new Set(
      this.nodes.flatMap((node) => (node.type === "materia" ? [node.data.codigo] : [])),
    );
    const calificaciones = new Map(
      materiasAprobadas
        .filter(
          ({ codigo, calificacion }) =>
            codigosMaterias.has(codigo) && esCalificacionAprobada(calificacion),
        )
        .map(({ codigo, calificacion }) => [codigo, calificacion]),
    );
    const codigosAprobadas = new Set(calificaciones.keys());

    this.nodes = this.nodes.map((node) => {
      if (node.type !== "materia") return node;

      const calificacion = calificaciones.get(node.data.codigo) ?? null;
      const correlativas = PLAN.correlatividades[node.data.codigo] ?? [];
      const estado =
        calificacion !== null
          ? "aprobada"
          : correlativas.every((codigo) => codigosAprobadas.has(codigo))
            ? "desbloqueada"
            : "bloqueada";

      return { ...node, data: { ...node.data, calificacion, estado } };
    });
  }

  private activarEdgesMateria(codigoMateria: string | null) {
    this.edges = this.edges.map((edge) => ({
      ...edge,
      class:
        codigoMateria !== null && (edge.source === codigoMateria || edge.target === codigoMateria)
          ? "edge-activo"
          : undefined,
    }));
  }
}

export default new GraphState();
