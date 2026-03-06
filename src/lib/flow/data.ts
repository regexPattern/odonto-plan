import type { Edge, Node, XYPosition } from "@xyflow/svelte";
import { PLAN, type Materia } from "$lib/data";

export type PlanNodeType = AnioNodeType | MateriaNodeType;

export type AnioNodeType = Node<AnioNodeData, "anio">;

export type AnioNodeData = {
  desc: string;
  width: number;
  height: number;
};

export type MateriaNodeType = Node<MateriaNodeData, "materia">;

export type MateriaNodeData = {
  codigo: string;
  nombre: string;
  width: number;
  height: number;
  status: "aprobada" | "bloqueada" | "desbloqueada";
};

const MATERIA_WIDTH = 256;
const MATERIA_HEIGHT = 72;
const ANIO_NODE_HEIGHT = 40;
const CUATRI_GAP_X = 80;
const ANUAL_WIDTH = MATERIA_WIDTH * 2 + CUATRI_GAP_X;
const ANIO_GAP_X = ANUAL_WIDTH + 160;
const FILA_GAP_Y = 110;
const MATERIAS_OFFSET_Y = ANIO_NODE_HEIGHT + (FILA_GAP_Y - MATERIA_HEIGHT);

const getPosicionesMaterias = (): Map<string, XYPosition> => {
  const posiciones = new Map<string, XYPosition>();

  PLAN.anios.forEach((anioPlan, anio) => {
    const baseX = anio * ANIO_GAP_X;
    const xC1 = baseX;
    const xC2 = baseX + MATERIA_WIDTH + CUATRI_GAP_X;
    const xCentro = baseX + (ANUAL_WIDTH - MATERIA_WIDTH) / 2;

    const esAnioElectivas = anioPlan.materias.every(
      (m) => m.cuatriInicial === null,
    );

    if (esAnioElectivas) {
      anioPlan.materias.forEach((materia, filaIndex) => {
        posiciones.set(materia.codigo, {
          x: xCentro,
          y: MATERIAS_OFFSET_Y + filaIndex * FILA_GAP_Y,
        });
      });

      return;
    }

    const anuales: Materia[] = [];
    const c1: Materia[] = [];
    const c2: Materia[] = [];
    const c12: Materia[] = [];

    anioPlan.materias.forEach((materia) => {
      if (materia.duracion === "Anual") {
        anuales.push(materia);
      } else if (Array.isArray(materia.cuatriInicial)) {
        c12.push(materia);
      } else if (materia.cuatriInicial === 1) {
        c1.push(materia);
      } else if (materia.cuatriInicial === 2) {
        c2.push(materia);
      }
    });

    anuales.forEach((materia, filaIndex) => {
      posiciones.set(materia.codigo, {
        x: xC1,
        y: MATERIAS_OFFSET_Y + filaIndex * FILA_GAP_Y,
      });
    });

    const inicioYCuatris = MATERIAS_OFFSET_Y + anuales.length * FILA_GAP_Y;

    c1.forEach((materia, filaIndex) => {
      posiciones.set(materia.codigo, {
        x: xC1,
        y: inicioYCuatris + filaIndex * FILA_GAP_Y,
      });
    });

    c2.forEach((materia, filaIndex) => {
      posiciones.set(materia.codigo, {
        x: xC2,
        y: inicioYCuatris + filaIndex * FILA_GAP_Y,
      });
    });

    const finYC1 = inicioYCuatris + c1.length * FILA_GAP_Y;
    const finYC2 = inicioYCuatris + c2.length * FILA_GAP_Y;
    const inicioYC12 = Math.max(finYC1, finYC2);

    c12.forEach((materia, filaIndex) => {
      posiciones.set(materia.codigo, {
        x: xCentro,
        y: inicioYC12 + filaIndex * FILA_GAP_Y,
      });
    });
  });

  return posiciones;
};

const anioNodes: AnioNodeType[] = PLAN.anios.map((anioPlan, anioIndex) => ({
  id: `anio-${anioIndex}`,
  position: {
    x: anioIndex * ANIO_GAP_X,
    y: 0,
  },
  data: {
    desc: anioPlan.descripcion,
    width: ANUAL_WIDTH,
    height: ANIO_NODE_HEIGHT,
  },
  type: "anio",
}));

const posicionesMaterias = getPosicionesMaterias();

const materiaNodes: MateriaNodeType[] = PLAN.anios.flatMap((a) =>
  a.materias.map((m) => ({
    id: m.codigo,
    position: posicionesMaterias.get(m.codigo)!,
    data: {
      codigo: m.codigo,
      nombre: m.nombre,
      width: m.duracion === "Anual" ? ANUAL_WIDTH : MATERIA_WIDTH,
      height: MATERIA_HEIGHT,
      status: "bloqueada",
    },
    type: "materia",
  })),
);

export const rawNodes: PlanNodeType[] = [...anioNodes, ...materiaNodes];

export const rawEdges: Edge[] = Object.entries(PLAN.correlatividades)
  .filter(([_, correlativas]) => correlativas.length)
  .flatMap(([materia, correlativas]) =>
    correlativas.map((correlativa) => ({
      id: `${correlativa}->${materia}`,
      source: correlativa,
      target: materia,
    })),
  );
