import { Position, type Edge, type XYPosition } from "@xyflow/svelte";
import type { MateriaPlan } from "#lib/plan/index.js";
import { PLAN } from "#lib/plan/index.js";
import type { AnioNodeType, MateriaNodeType, PlanNodeType } from ".";

const MATERIA_WIDTH = 256;
const MATERIA_HEIGHT = 72;
const ANIO_NODE_HEIGHT = 40;
const HANDLE_SIZE = 6;
const CUATRI_GAP_X = 80;
export const ANUAL_WIDTH = MATERIA_WIDTH * 2 + CUATRI_GAP_X;
export const ANIO_GAP_X = ANUAL_WIDTH + 160;
export const MIN_ZOOM = 0.4;
export const MAX_ZOOM = 1;

/** Animación de desplazamiento entre años: easeInOutCubic, suave al arrancar y al frenar. */
export const ANIMACION_VISTA = {
  duration: 550,
  ease: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
};

/**
 * Vista que centra la columna de un año. En pantallas angostas baja el zoom para que
 * el año entre completo en el ancho, sin tener que achicar los nodos.
 */
export const vistaParaAnio = (anio: number, ancho: number) => {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (ancho - 16) / ANUAL_WIDTH));
  return {
    x: ancho / 2 - (anio * ANIO_GAP_X + ANUAL_WIDTH / 2) * zoom,
    y: ancho < 640 ? 72 : 100,
    zoom,
  };
};
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

  const anuales: MateriaPlan[] = [];
  const c1: MateriaPlan[] = [];
  const c2: MateriaPlan[] = [];
  const c12: MateriaPlan[] = [];

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
  style: "pointer-events: none;",
  width: ANUAL_WIDTH,
  height: ANIO_NODE_HEIGHT,
  position: {
    x: anioIndex * ANIO_GAP_X,
    y: 0,
  },
  data: {
    indice: anioIndex,
    descripcion: anioPlan.descripcion,
    width: ANUAL_WIDTH,
    height: ANIO_NODE_HEIGHT,
  },
  type: "anio",
}));

const conDependientes = new Set(Object.values(PLAN.correlatividades).flat());

const handle = (type: "source" | "target", x: number) => ({
  type,
  position: type === "source" ? Position.Right : Position.Left,
  x: x - HANDLE_SIZE / 2,
  y: (MATERIA_HEIGHT - HANDLE_SIZE) / 2,
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
});

const materiaNodes: MateriaNodeType[] = PLAN.anios.flatMap((a) =>
  a.materias.map((m) => {
    const width = m.duracion === "Anual" ? ANUAL_WIDTH : MATERIA_WIDTH;
    const tieneCorrelativas = PLAN.correlatividades[m.codigo]?.length > 0;
    return {
      id: m.codigo,
      position: posicionesMaterias.get(m.codigo)!,
      width,
      height: MATERIA_HEIGHT,
      handles: [
        ...(tieneCorrelativas ? [handle("target", 0)] : []),
        ...(conDependientes.has(m.codigo) ? [handle("source", width)] : []),
      ],
      data: {
        codigo: m.codigo,
        nombre: m.nombre,
        duracion: m.duracion,
        horas: m.horas,
        estado: tieneCorrelativas ? "bloqueada" : "desbloqueada",
        calificacion: null,
        width,
        height: MATERIA_HEIGHT,
      },
      type: "materia",
    };
  }),
);

export const rawNodes: PlanNodeType[] = [...anioNodes, ...materiaNodes];

export const rawEdges: Edge[] = Object.entries(PLAN.correlatividades)
  .filter(([_, correlativas]) => correlativas.length)
  .flatMap(([materia, correlativas]) =>
    correlativas.map((c) => ({
      id: `${c}->${materia}`,
      source: c,
      target: materia,
    })),
  );
