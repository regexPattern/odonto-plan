import type { Edge, Node, XYPosition } from "@xyflow/svelte";
import { PLAN, type Materia } from "$lib/data";

export type AnioNodeType = Node<AnioNodeData, "anio">;

type AnioNodeData = {
  desc: string;
};

export type MateriaNodeType = Node<MateriaNodeData, "materia">;

type MateriaNodeData = {
  codigo: string;
  nombre: string;
};

const getPositionMateria = (_: Materia, anio: number): XYPosition => {
  return { x: anio * 200, y: 0 };
};

export const nodes: MateriaNodeType[] = PLAN.anios.flatMap((a, i) =>
  a.materias.map((m) => ({
    id: m.codigo,
    position: getPositionMateria(m, i),
    data: { codigo: m.codigo, nombre: m.nombre },
    type: "materia",
  })),
);

export const edges: Edge[] = Object.entries(PLAN.correlatividades)
  .filter(([_, correlativas]) => correlativas.length)
  .flatMap(([materia, correlativas]) =>
    correlativas.map((correlativa) => ({
      id: `${correlativa}->${materia}`,
      source: correlativa,
      target: materia,
    })),
  );

const esAnual = () => {
  return false;
};
