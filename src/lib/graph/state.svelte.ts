import type { NodeTypes } from "@xyflow/svelte";
import { AnioNode, MateriaNode } from "./components/index.js";
import { rawEdges, rawNodes } from "./layout.js";
import type { MateriaNodeData } from ".";

export const nodeTypes: NodeTypes = {
  anio: AnioNode,
  materia: MateriaNode,
};

let nodes = $state.raw(rawNodes);
let edges = $state.raw(rawEdges);

let materiaSeleccionada: MateriaNodeData | null = $state(null);

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
  },
  deseleccionarMateria() {
    materiaSeleccionada = null;
  },
};
