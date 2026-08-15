import type { Node } from "@xyflow/svelte";

export type PlanNodeType = AnioNodeType | MateriaNodeType;

export type AnioNodeType = Node<AnioNodeData, "anio">;
export type AnioNodeData = {
  descripcion: string;
  width: number;
  height: number;
};

export type MateriaNodeType = Node<MateriaNodeData, "materia">;
export type MateriaNodeData = {
  codigo: string;
  nombre: string;
  estado: "aprobada" | "bloqueada" | "desbloqueada";
  calificacion: number | null;
  width: number;
  height: number;
};
