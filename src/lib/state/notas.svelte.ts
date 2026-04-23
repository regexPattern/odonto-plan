import { SvelteMap } from "svelte/reactivity";

export type Nota = {
	nota: number;
	aplasos: number;
};

export let notasState = $state(new SvelteMap<string, Nota>());

export const setNotaMateria = (codigoMateria: string, nota: Nota) => {
	notasState.set(codigoMateria, nota);
};

export const eliminarNotaMateria = (codigoMateria: string) => {
	notasState.delete(codigoMateria);
};
