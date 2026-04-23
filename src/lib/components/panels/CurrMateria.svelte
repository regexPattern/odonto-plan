<script lang="ts">
	import type { MateriaNodeType } from "$lib/plan";
	import { AlarmClock, CalendarDays, CircleX } from "@lucide/svelte";
	import { useNodesData, useSvelteFlow } from "@xyflow/svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { flowState } from "$lib/state/flow.svelte";

	let { updateNodeData } = useSvelteFlow();

	let materiaNodeData = $derived(useNodesData<MateriaNodeType>(flowState.currNodeId || ""));

	$inspect(materiaNodeData.current?.data);
</script>

{#if materiaNodeData.current}
	{@const materia = materiaNodeData.current}

	<Card.Root class="w-[300px] bg-card/90 backdrop-blur-lg">
		<Card.Header>
			<Card.Title>{materia.data.nombre}</Card.Title>
		</Card.Header>

		<Card.Content>
			<p class="flex items-center gap-1.5">
				<CalendarDays class="size-[16px] shrink-0" /> Duración: {materia.data.duracion}
			</p>
			<p class="flex items-center gap-1.5">
				<AlarmClock class="size-[16px] shrink-0" />Carga horaria: {materia.data.horas}
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
					value={materia.data.nota}
					onchange={(e) => {
						const nota = e.currentTarget.valueAsNumber;
						updateNodeData(materia.id, { nota });
					}}
				/>
				<Button
					aria-label="reset-nota"
					onclick={() => {
						updateNodeData(materia.id, { nota: 0 });
					}}
				>
					<CircleX />
				</Button>

				<Label for="aplasos" class="mr-1">Aplasos</Label>
				<Input
					id="aplasos"
					type="number"
					min="0"
					class="w-full"
					value={materia.data.aplasos}
					onchange={(e) => {
						const aplasos = e.currentTarget.valueAsNumber;
						updateNodeData(materia.id, { aplasos });
					}}
				/>
				<Button
					aria-label="reset-aplasos"
					onclick={() => {
						updateNodeData(materia.id, { aplasos: 0 });
					}}
				>
					<CircleX />
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
{/if}
