import type { Edge, Node } from "@xyflow/svelte";
import * as v from "valibot";
import { PUBLIC_NOTAS_STORAGE_KEY } from "$env/static/public";

export const materiaSchema = v.object({
	codigo: v.string(),
	nombre: v.string(),
	cuatri_inicial: v.optional(v.picklist([0, 1, 2])),
	duracion: v.picklist(["Bimestral", "Semestral", "Anual"]),
	horas: v.string()
});

export const planSchema = v.object({
	anios: v.array(
		v.object({
			descripcion: v.string(),
			materias: v.array(materiaSchema)
		})
	),
	electivas: v.array(materiaSchema),
	correlatividades: v.record(v.string(), v.array(v.string()))
});

export type PlanType = v.InferOutput<typeof planSchema>;
export type MateriaType = v.InferOutput<typeof materiaSchema>;

type Expand<T> = {
	[K in keyof T]: T[K];
} & {};

export type MateriaNodeData = Expand<
	MateriaType & {
		nota: number;
		aplasos: number;
	}
>;
export type AnioNodeData = { descripcion: string };
export type MateriaNodeType = Node<MateriaNodeData, "materia">;
export type AnioNodeType = Node<AnioNodeData, "anio">;

export const notasSchema = v.record(
	v.string(),
	v.object({
		nota: v.number(),
		aplasos: v.number()
	})
);

export type NotasType = v.InferOutput<typeof notasSchema>;
export const NOTAS_STORAGE_KEY = PUBLIC_NOTAS_STORAGE_KEY;

export const parseNotas = (storedNotas: string | null) => {
	let parsedNotas: unknown = {};

	if (storedNotas) {
		try {
			parsedNotas = JSON.parse(storedNotas);
		} catch {
			parsedNotas = null;
		}
	}

	return v.safeParse(notasSchema, parsedNotas);
};

export const NODO_WIDTH_PX = 260;
export const NODO_HEIGHT_PX = 90;

export const PADDING_CUATRI_PX = 60;
const PADDING_ANIO_PX = 180;
const ANIO_WIDTH_PX = 2 * NODO_WIDTH_PX + PADDING_CUATRI_PX;
const VERTICAL_STEP_PX = NODO_HEIGHT_PX + PADDING_CUATRI_PX;

export const initialGraph = (plan: PlanType, initialNotas: NotasType = {}): [Node[], Edge[]] => {
	const materiaNodes = plan.anios.flatMap((a, i) => {
		const initialNodes: MateriaNodeType[] = a.materias.map((m) => {
			const initialNota = initialNotas[m.codigo];

			return {
				id: m.codigo,
				position: {
					x: i * (ANIO_WIDTH_PX + PADDING_ANIO_PX),
					y: NODO_HEIGHT_PX + PADDING_CUATRI_PX / 2
				},
				width: NODO_WIDTH_PX,
				height: NODO_HEIGHT_PX,
				data: {
					...m,
					nota: initialNota?.nota ?? 0,
					aplasos: initialNota?.aplasos ?? 0
				} as MateriaNodeData,
				type: "materia"
			};
		});

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

	const electivasNodes: MateriaNodeType[] = plan.electivas.map((e, i) => {
		const initialNota = initialNotas[e.codigo];

		return {
			id: e.codigo,
			position: {
				x: plan.anios.length * (ANIO_WIDTH_PX + PADDING_ANIO_PX),
				y: NODO_HEIGHT_PX + PADDING_CUATRI_PX + i * VERTICAL_STEP_PX
			},
			width: NODO_WIDTH_PX,
			height: NODO_HEIGHT_PX,
			data: {
				...e,
				nota: initialNota?.nota ?? 0,
				aplasos: initialNota?.aplasos ?? 0
			},
			type: "materia"
		};
	});

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
