import type { Edge, Node } from "@xyflow/svelte";

export type Plan = {
	anios: { descripcion: string; materias: Materia[] }[];
	electivas: Materia[];
	correlatividades: { [materia: string]: string[] };
};

export type Materia = {
	codigo: string;
	nombre: string;
	cuatri_inicial?: 0 | 1 | 2 | null;
	duracion: "Bimestral" | "Semestral" | "Anual";
	horas: string;
};

export type MateriaNodeType = Node<
	Materia & {
		tiene_correlativas: boolean;
		es_correlativa: boolean;
	} & {
		nota: number;
		aplasos: number;
	},
	"materia"
>;
export type AnioNodeType = Node<{ descripcion: string }, "anio">;

export const NODO_WIDTH_PX = 260;
export const NODO_HEIGHT_PX = 90;

export const PADDING_CUATRI_PX = 60;
const PADDING_ANIO_PX = 180;
const ANIO_WIDTH_PX = 2 * NODO_WIDTH_PX + PADDING_CUATRI_PX;
const VERTICAL_STEP_PX = NODO_HEIGHT_PX + PADDING_CUATRI_PX;

export const initialGraph = (plan: Plan): [Node[], Edge[]] => {
	const sonCorrelativas = new Set(Object.values(plan.correlatividades).flatMap((c) => c));

	const materiaNodes: MateriaNodeType[] = plan.anios.flatMap((a, i) => {
		const initialNodes: MateriaNodeType[] = a.materias.map((m) => ({
			id: m.codigo,
			position: {
				x: i * (ANIO_WIDTH_PX + PADDING_ANIO_PX),
				y: NODO_HEIGHT_PX + PADDING_CUATRI_PX / 2
			},
			width: NODO_WIDTH_PX,
			height: NODO_HEIGHT_PX,
			data: {
				...m,
				tiene_correlativas: plan.correlatividades[m.codigo]?.length > 0 || false,
				es_correlativa: sonCorrelativas.has(m.codigo),
				nota: 0,
				aplasos: 0
			},
			type: "materia"
		}));

		const anuales = initialNodes
			.filter((n) => n.data.duracion === "Anual")
			.map((n, i) => {
				n.position.y += i * VERTICAL_STEP_PX;
				n.width = ANIO_WIDTH_PX;
				return n;
			});

		const primerCuatri = initialNodes
			.filter((n) => n.data.duracion !== "Anual" && n.data.cuatri_inicial === 1)
			.map((n, i) => {
				n.position.y += (anuales.length + i) * VERTICAL_STEP_PX;
				return n;
			});

		const segundoCuatri = initialNodes
			.filter((n) => n.data.duracion !== "Anual" && n.data.cuatri_inicial === 2)
			.map((n, i) => {
				n.position.x += NODO_WIDTH_PX + PADDING_CUATRI_PX;
				n.position.y += (anuales.length + i) * VERTICAL_STEP_PX;
				return n;
			});

		const cualquierCuatri = initialNodes
			.filter((n) => n.data.duracion !== "Anual" && n.data.cuatri_inicial === 0)
			.map((n, i) => {
				n.position.x += (ANIO_WIDTH_PX - NODO_WIDTH_PX) / 2;
				n.position.y +=
					(anuales.length + Math.max(primerCuatri.length, segundoCuatri.length) + i) *
					VERTICAL_STEP_PX;
				return n;
			});

		return [...anuales, ...primerCuatri, ...segundoCuatri, ...cualquierCuatri];
	});

	const electivasNodes: MateriaNodeType[] = plan.electivas.map((e, i) => ({
		id: e.codigo,
		position: {
			x: plan.anios.length * (ANIO_WIDTH_PX + PADDING_ANIO_PX),
			y: NODO_HEIGHT_PX + PADDING_CUATRI_PX + i * VERTICAL_STEP_PX
		},
		width: NODO_WIDTH_PX,
		height: NODO_HEIGHT_PX,
		data: {
			...e,
			tiene_correlativas: plan.correlatividades[e.codigo]?.length > 0 || false,
			es_correlativa: sonCorrelativas.has(e.codigo),
			nota: 0,
			aplasos: 0
		},
		type: "materia"
	}));

	const anioNodes = plan.anios.map((a, i) => ({
		id: `${i}`,
		position: {
			x: i * (ANIO_WIDTH_PX + PADDING_ANIO_PX),
			y: 0
		},
		width: ANIO_WIDTH_PX,
		height: NODO_HEIGHT_PX,
		data: { descripcion: a.descripcion },
		type: "anio"
	}));

	const edges = Object.entries(plan.correlatividades).flatMap(([m, c]) =>
		c.map((mc) => ({ id: `${mc}->${m}`, source: mc, target: m }))
	);

	return [[...materiaNodes, ...electivasNodes, ...anioNodes], edges];
};
