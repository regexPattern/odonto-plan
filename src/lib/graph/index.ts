import type { Node, NodeTypes } from "@xyflow/svelte";
import { AnioNode, MateriaNode } from "./components";

export type PlanNodeType = AnioNodeType | MateriaNodeType;

export type AnioNodeType = Node<AnioNodeData, "anio">;
export type AnioNodeData = {
  descripcion: string;
  width: number;
  height: number;
};

export type MateriaNodeType = Node<MateriaNodeData, "materia">;
export type MateriaAprobada = {
  codigo: string;
  calificacion: number;
};

export const esCalificacionAprobada = (calificacion: unknown): calificacion is number =>
  typeof calificacion === "number" &&
  Number.isInteger(calificacion) &&
  calificacion >= 4 &&
  calificacion <= 10;

export type MateriaNodeData = {
  codigo: string;
  nombre: string;
  duracion: "Bimestral" | "Semestral" | "Anual";
  horas: string;
  estado: "aprobada" | "bloqueada" | "desbloqueada";
  calificacion: number | null;
  width: number;
  height: number;
};

export const nodeTypes: NodeTypes = {
  anio: AnioNode,
  materia: MateriaNode,
};
