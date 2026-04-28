<script lang="ts">
	import type { MateriaNodeData, MateriaNodeType } from "$lib/data/plan";
	import { AlarmClock, CalendarDays, CircleX } from "@lucide/svelte";
	import { useNodesData, useSvelteFlow } from "@xyflow/svelte";
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { NOTAS_STORAGE_KEY, parseNotas } from "$lib/data/plan";
	import { State } from "$lib/state.svelte";

	let { updateNodeData } = useSvelteFlow();

	const currNode = $derived(
		useNodesData<MateriaNodeType>(State.selectedMateriaNodeId || "").current
	);
	let materia = $derived(currNode?.data);

	const NOTAS_UPDATE_DEBOUNCE_MS = 300;

	let updateNotasTimeout: ReturnType<typeof setTimeout> | undefined;
	let pendingCodigo: string | undefined;
	let pendingMateria: MateriaNodeData | undefined;

	const persistMateriaNotas = (codigo: string, materia: MateriaNodeData) => {
		const storedNotas = localStorage.getItem(NOTAS_STORAGE_KEY);
		const parsedNotas = parseNotas(storedNotas);
		const notas = parsedNotas.success ? parsedNotas.output : {};

		localStorage.setItem(
			NOTAS_STORAGE_KEY,
			JSON.stringify({
				...notas,
				[codigo]: {
					nota: materia.nota,
					aplasos: materia.aplasos
				}
			})
		);
	};

	const updateMateriaNotas = (codigo: string, materia: MateriaNodeData) => {
		updateNodeData(codigo, materia);
		persistMateriaNotas(codigo, materia);
	};

	const flushPendingNotas = () => {
		if (!pendingCodigo || !pendingMateria) {
			return;
		}

		updateMateriaNotas(pendingCodigo, pendingMateria);
		pendingCodigo = undefined;
		pendingMateria = undefined;
	};

	const debouncedUpdateMateriaNotas = (
		codigo: string,
		baseMateria: MateriaNodeData,
		notas: Partial<Pick<MateriaNodeData, "nota" | "aplasos">>
	) => {
		pendingCodigo = codigo;
		pendingMateria = {
			...(pendingCodigo === codigo && pendingMateria ? pendingMateria : baseMateria),
			...notas
		};

		if (updateNotasTimeout) {
			clearTimeout(updateNotasTimeout);
		}

		updateNotasTimeout = setTimeout(flushPendingNotas, NOTAS_UPDATE_DEBOUNCE_MS);
	};

	onDestroy(() => {
		if (updateNotasTimeout) {
			clearTimeout(updateNotasTimeout);
		}

		flushPendingNotas();
	});
</script>

{#if currNode && materia}
	<Card.Root class="w-75 bg-card/90 backdrop-blur-lg">
		<Card.Header>
			<Card.Title>{materia.nombre}</Card.Title>
		</Card.Header>

		<Card.Content>
			<p class="flex items-center gap-1.5">
				<CalendarDays class="size-4 shrink-0" /> Duración: {materia.duracion}
			</p>
			<p class="flex items-center gap-1.5">
				<AlarmClock class="size-4 shrink-0" />Carga horaria: {materia.horas}
			</p>
		</Card.Content>

		<Card.Footer>
			<div class="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-1 gap-y-2">
				<Label for="nota" class="mr-1">Nota</Label>
				<Input
					id="nota"
					type="number"
					min="4"
					max="10"
					class="w-full"
					value={materia.nota}
					oninput={(e) => {
						debouncedUpdateMateriaNotas(currNode.id, materia, {
							nota: e.currentTarget.valueAsNumber
						});
					}}
				/>
				<Button
					aria-label="reset-nota"
					onclick={() => debouncedUpdateMateriaNotas(currNode.id, materia, { nota: 0 })}
				>
					<CircleX />
				</Button>

				<Label for="aplasos" class="mr-1">Aplasos</Label>
				<Input
					id="aplasos"
					type="number"
					min="0"
					class="w-full"
					value={materia.aplasos}
					oninput={(e) => {
						debouncedUpdateMateriaNotas(currNode.id, materia, {
							aplasos: e.currentTarget.valueAsNumber
						});
					}}
				/>
				<Button
					aria-label="reset-aplasos"
					onclick={() => debouncedUpdateMateriaNotas(currNode.id, materia, { aplasos: 0 })}
				>
					<CircleX />
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
{/if}
