import type { Edge, XYPosition } from "@xyflow/svelte";
import type { Materia } from "#lib/plan/index.js";
import { PLAN } from "#lib/plan/index.js";
import type { AnioNodeType, MateriaNodeType, PlanNodeType } from ".";

const MATERIA_WIDTH = 256;
const MATERIA_HEIGHT = 72;
const ANIO_NODE_HEIGHT = 40;
const CUATRI_GAP_X = 80;
const ANUAL_WIDTH = MATERIA_WIDTH * 2 + CUATRI_GAP_X;
const ANIO_GAP_X = ANUAL_WIDTH + 160;
const FILA_GAP_Y = 110;
const MATERIAS_OFFSET_Y = ANIO_NODE_HEIGHT + (FILA_GAP_Y - MATERIA_HEIGHT);

const posicionesMaterias = new Map<string, XYPosition>();

for (const [anio, anioPlan] of PLAN.anios.entries()) {
  const baseX = anio * ANIO_GAP_X;
  const xC1 = baseX;
  const xC2 = baseX + MATERIA_WIDTH + CUATRI_GAP_X;
  const xCentro = baseX + (ANUAL_WIDTH - MATERIA_WIDTH) / 2;

  const esAnioElectivas = anioPlan.materias.every((m) => m.cuatriInicial === null);

  if (esAnioElectivas) {
    for (const [filaIndex, materia] of anioPlan.materias.entries()) {
      posicionesMaterias.set(materia.codigo, {
        x: xCentro,
        y: MATERIAS_OFFSET_Y + filaIndex * FILA_GAP_Y,
      });
    }

    continue;
  }

  const anuales: Materia[] = [];
  const c1: Materia[] = [];
  const c2: Materia[] = [];
  const c12: Materia[] = [];

  for (const materia of anioPlan.materias) {
    if (materia.duracion === "Anual") {
      anuales.push(materia);
    } else if (Array.isArray(materia.cuatriInicial)) {
      c12.push(materia);
    } else if (materia.cuatriInicial === 1) {
      c1.push(materia);
    } else if (materia.cuatriInicial === 2) {
      c2.push(materia);
    }
  }

  for (const [filaIndex, materia] of anuales.entries()) {
    posicionesMaterias.set(materia.codigo, {
      x: xC1,
      y: MATERIAS_OFFSET_Y + filaIndex * FILA_GAP_Y,
    });
  }

  const inicioYCuatris = MATERIAS_OFFSET_Y + anuales.length * FILA_GAP_Y;

  for (const [filaIndex, materia] of c1.entries()) {
    posicionesMaterias.set(materia.codigo, {
      x: xC1,
      y: inicioYCuatris + filaIndex * FILA_GAP_Y,
    });
  }

  for (const [filaIndex, materia] of c2.entries()) {
    posicionesMaterias.set(materia.codigo, {
      x: xC2,
      y: inicioYCuatris + filaIndex * FILA_GAP_Y,
    });
  }

  const finYC1 = inicioYCuatris + c1.length * FILA_GAP_Y;
  const finYC2 = inicioYCuatris + c2.length * FILA_GAP_Y;
  const inicioYC12 = Math.max(finYC1, finYC2);

  for (const [filaIndex, materia] of c12.entries()) {
    posicionesMaterias.set(materia.codigo, {
      x: xCentro,
      y: inicioYC12 + filaIndex * FILA_GAP_Y,
    });
  }
}

const anioNodes: AnioNodeType[] = PLAN.anios.map((anioPlan, anioIndex) => ({
  id: `anio-${anioIndex}`,
  position: {
    x: anioIndex * ANIO_GAP_X,
    y: 0,
  },
  data: {
    descripcion: anioPlan.descripcion,
    width: ANUAL_WIDTH,
    height: ANIO_NODE_HEIGHT,
  },
  type: "anio",
}));

const materiaNodes: MateriaNodeType[] = PLAN.anios.flatMap((a) =>
  a.materias.map((m) => ({
    id: m.codigo,
    position: posicionesMaterias.get(m.codigo)!,
    data: {
      codigo: m.codigo,
      nombre: m.nombre,
      duracion: m.duracion,
      horas: m.horas,
      estado: PLAN.correlatividades[m.codigo]?.length ? "bloqueada" : "desbloqueada",
      calificacion: null,
      width: m.duracion === "Anual" ? ANUAL_WIDTH : MATERIA_WIDTH,
      height: MATERIA_HEIGHT,
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
