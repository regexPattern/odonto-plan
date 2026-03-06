import type { Edge, Node, XYPosition } from "@xyflow/svelte";
import { PLAN, type Materia } from "$lib/data";

export type AnioNodeType = Node<AnioNodeData, "anio">;

type AnioNodeData = {
  desc: string;
};

export type MateriaNodeType = Node<MateriaNodeData, "materia">;

export type MateriaNodeData = {
  codigo: string;
  nombre: string;
  width: number;
};

const MATERIA_WIDTH = 300;
const COL_GAP_X = 80;
const ANUAL_WIDTH = MATERIA_WIDTH * 2 + COL_GAP_X;
const ANIO_GAP_X = ANUAL_WIDTH + 160;
const FILA_GAP_Y = 110;

const getPosicionesMaterias = (): Map<string, XYPosition> => {
  const posiciones = new Map<string, XYPosition>();

  PLAN.anios.forEach((anioPlan, anio) => {
    const baseX = anio * ANIO_GAP_X;
    const xC1 = baseX;
    const xC2 = baseX + MATERIA_WIDTH + COL_GAP_X;
    const xCentro = baseX + (ANUAL_WIDTH - MATERIA_WIDTH) / 2;

    const esAnioElectivas = anioPlan.materias.every(
      (m) => m.cuatriInicial === null,
    );

    if (esAnioElectivas) {
      anioPlan.materias.forEach((materia, filaIndex) => {
        posiciones.set(materia.codigo, {
          x: xCentro,
          y: filaIndex * FILA_GAP_Y,
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
        y: filaIndex * FILA_GAP_Y,
      });
    });

    const inicioYCuatris = anuales.length * FILA_GAP_Y;

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

const posicionesMaterias = getPosicionesMaterias();

export const nodes: MateriaNodeType[] = PLAN.anios.flatMap((a) =>
  a.materias.map((m) => ({
    id: m.codigo,
    position: posicionesMaterias.get(m.codigo)!,
    data: {
      codigo: m.codigo,
      nombre: m.nombre,
      width: m.duracion === "Anual" ? ANUAL_WIDTH : MATERIA_WIDTH,
    },
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
