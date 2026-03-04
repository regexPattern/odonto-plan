import type { Edge, Node } from "@xyflow/svelte";
import { CORRELATIVIDADES, MATERIAS, type Materia } from "./data-materias";

export const CANTIDAD_CUATRIMESTRES = 12;
export const GAP_PX = 16;
export const GAP_ANIO_PX = GAP_PX * 3;

export const WIDTH_NODO_MATERIA_PX = 240;
export const HEIGHT_NODO_MATERIA_PX = 88;

export const HEIGHT_NODO_ANIO_PX = 44;

const MARGEN_IZQUIERDO_PX = 48;
const MARGEN_SUPERIOR_PX = 40;

const TITULOS_ANIO = [
  "CBC",
  "2do año",
  "3er año",
  "4to año",
  "5to año",
  "6to año",
];

export type NodoMateriaType = {
  materia: Materia;
  descripcionCargaHoraria: string;
};

export type NodoAnioType = {
  descripcion: string;
};

function esCuatrimestreUnico(
  cuatrimestreInicial: Materia["cuatrimestreInicial"],
): cuatrimestreInicial is number {
  return typeof cuatrimestreInicial === "number";
}

function esCuatrimestreDoble(
  cuatrimestreInicial: Materia["cuatrimestreInicial"],
): cuatrimestreInicial is [number, number] {
  return Array.isArray(cuatrimestreInicial);
}

function obtenerXPorCuatrimestre(): Record<number, number> {
  const xPorCuatrimestre: Record<number, number> = { 1: MARGEN_IZQUIERDO_PX };

  for (
    let cuatrimestre = 2;
    cuatrimestre <= CANTIDAD_CUATRIMESTRES;
    cuatrimestre += 1
  ) {
    const esPrimerCuatrimestreDeAnio = cuatrimestre % 2 === 1;
    const gap = esPrimerCuatrimestreDeAnio ? GAP_ANIO_PX : GAP_PX;
    xPorCuatrimestre[cuatrimestre] =
      xPorCuatrimestre[cuatrimestre - 1] + WIDTH_NODO_MATERIA_PX + gap;
  }

  return xPorCuatrimestre;
}

function crearNodoAnio(
  id: string,
  descripcion: string,
  x: number,
  y: number,
  width: number,
): Node<NodoAnioType> {
  return {
    id,
    type: "anio",
    position: { x, y },
    style: `width: ${width}px; height: ${HEIGHT_NODO_ANIO_PX}px;`,
    data: { descripcion },
    selectable: false,
    draggable: false,
    deletable: false,
  };
}

function crearNodoMateria(
  id: string,
  materia: Materia,
  x: number,
  y: number,
  width = WIDTH_NODO_MATERIA_PX,
): Node<NodoMateriaType> {
  return {
    id,
    type: "materia",
    position: { x, y },
    style: `width: ${width}px; height: ${HEIGHT_NODO_MATERIA_PX}px;`,
    data: {
      materia,
      descripcionCargaHoraria: materia.cargaHoraria,
    },
  };
}

const xPorCuatrimestre = obtenerXPorCuatrimestre();
const nodosMateria: Node<NodoMateriaType>[] = [];
const nodosAnio: Node<NodoAnioType>[] = [];

const yInicioAnios = MARGEN_SUPERIOR_PX;

for (let anio = 1; anio <= CANTIDAD_CUATRIMESTRES / 2; anio += 1) {
  const cuatrimestreIzquierdo = anio * 2 - 1;
  const cuatrimestreDerecho = anio * 2;
  const materiasDelAnio = MATERIAS.filter((materia) => {
    if (esCuatrimestreUnico(materia.cuatrimestreInicial)) {
      return (
        materia.cuatrimestreInicial === cuatrimestreIzquierdo ||
        materia.cuatrimestreInicial === cuatrimestreDerecho
      );
    }

    if (esCuatrimestreDoble(materia.cuatrimestreInicial)) {
      const [inicioA, inicioB] = materia.cuatrimestreInicial;
      return (
        (inicioA === cuatrimestreIzquierdo &&
          inicioB === cuatrimestreDerecho) ||
        (inicioA === cuatrimestreDerecho && inicioB === cuatrimestreIzquierdo)
      );
    }

    return false;
  });

  const materiasAnuales = materiasDelAnio.filter(
    (materia) =>
      esCuatrimestreUnico(materia.cuatrimestreInicial) &&
      materia.duracion === "Anual" &&
      materia.cuatrimestreInicial === cuatrimestreIzquierdo,
  );

  const materiasCuatrimestreIzquierdo = materiasDelAnio.filter(
    (materia) =>
      esCuatrimestreUnico(materia.cuatrimestreInicial) &&
      materia.duracion !== "Anual" &&
      materia.cuatrimestreInicial === cuatrimestreIzquierdo,
  );

  const materiasCuatrimestreDerecho = materiasDelAnio.filter(
    (materia) =>
      esCuatrimestreUnico(materia.cuatrimestreInicial) &&
      materia.duracion !== "Anual" &&
      materia.cuatrimestreInicial === cuatrimestreDerecho,
  );

  const materiasInicioDoble = materiasDelAnio.filter((materia) =>
    esCuatrimestreDoble(materia.cuatrimestreInicial),
  );

  const xIzquierda = xPorCuatrimestre[cuatrimestreIzquierdo];
  const xDerecha = xPorCuatrimestre[cuatrimestreDerecho];
  const xCentroEntreCuatrimestres =
    xIzquierda + Math.floor((WIDTH_NODO_MATERIA_PX + GAP_PX) / 2);
  const widthNodoAnio = WIDTH_NODO_MATERIA_PX * 2 + GAP_PX;

  nodosAnio.push(
    crearNodoAnio(
      `ANIO-${anio}`,
      TITULOS_ANIO[anio - 1] ?? `Año ${anio}`,
      xIzquierda,
      yInicioAnios,
      widthNodoAnio,
    ),
  );

  const yInicioMaterias = yInicioAnios + HEIGHT_NODO_ANIO_PX + GAP_PX;
  let yMaximoAnio = yInicioMaterias;

  let yAnuales = yInicioMaterias;
  for (const materia of materiasAnuales) {
    nodosMateria.push(
      crearNodoMateria(
        materia.codigo,
        materia,
        xIzquierda,
        yAnuales,
        WIDTH_NODO_MATERIA_PX * 2 + GAP_PX,
      ),
    );
    yMaximoAnio = Math.max(yMaximoAnio, yAnuales + HEIGHT_NODO_MATERIA_PX);
    yAnuales += HEIGHT_NODO_MATERIA_PX + GAP_PX;
  }

  const yInicioColumnas =
    materiasAnuales.length > 0 ? yAnuales : yInicioMaterias;

  let yIzquierda = yInicioColumnas;
  for (const materia of materiasCuatrimestreIzquierdo) {
    nodosMateria.push(
      crearNodoMateria(materia.codigo, materia, xIzquierda, yIzquierda),
    );
    yMaximoAnio = Math.max(yMaximoAnio, yIzquierda + HEIGHT_NODO_MATERIA_PX);
    yIzquierda += HEIGHT_NODO_MATERIA_PX + GAP_PX;
  }

  let yDerecha = yInicioColumnas;
  for (const materia of materiasCuatrimestreDerecho) {
    nodosMateria.push(
      crearNodoMateria(materia.codigo, materia, xDerecha, yDerecha),
    );
    yMaximoAnio = Math.max(yMaximoAnio, yDerecha + HEIGHT_NODO_MATERIA_PX);
    yDerecha += HEIGHT_NODO_MATERIA_PX + GAP_PX;
  }

  const yInicioDoble = Math.max(yIzquierda, yDerecha, yInicioColumnas);
  let yDoble = yInicioDoble;
  for (const materia of materiasInicioDoble) {
    nodosMateria.push(
      crearNodoMateria(
        materia.codigo,
        materia,
        xCentroEntreCuatrimestres,
        yDoble,
      ),
    );
    yMaximoAnio = Math.max(yMaximoAnio, yDoble + HEIGHT_NODO_MATERIA_PX);
    yDoble += HEIGHT_NODO_MATERIA_PX + GAP_PX;
  }
}

const materiasElectivas = MATERIAS.filter(
  (materia) => materia.cuatrimestreInicial === null,
);

if (materiasElectivas.length > 0) {
  const xColumnaElectivas =
    xPorCuatrimestre[CANTIDAD_CUATRIMESTRES] +
    WIDTH_NODO_MATERIA_PX +
    GAP_ANIO_PX;

  nodosAnio.push(
    crearNodoAnio(
      "SECCION-ELECTIVAS",
      "Electivas",
      xColumnaElectivas,
      yInicioAnios,
      WIDTH_NODO_MATERIA_PX,
    ),
  );

  const yInicioElectivas = yInicioAnios + HEIGHT_NODO_ANIO_PX + GAP_PX;
  for (let indice = 0; indice < materiasElectivas.length; indice += 1) {
    const materia = materiasElectivas[indice];
    const y = yInicioElectivas + indice * (HEIGHT_NODO_MATERIA_PX + GAP_PX);
    nodosMateria.push(
      crearNodoMateria(materia.codigo, materia, xColumnaElectivas, y),
    );
  }
}

export const nodos: Node[] = [...nodosAnio, ...nodosMateria];

const idsNodos = new Set(nodos.map((nodo) => nodo.id));

export const vertices: Edge[] = CORRELATIVIDADES.filter(
  (correlatividad) =>
    idsNodos.has(correlatividad.codigoCorrelativa) &&
    idsNodos.has(correlatividad.codigoDependiente),
).map((correlatividad, indice) => ({
  id: `e-${indice}-${correlatividad.codigoCorrelativa}-${correlatividad.codigoDependiente}`,
  source: correlatividad.codigoCorrelativa,
  target: correlatividad.codigoDependiente,
}));
