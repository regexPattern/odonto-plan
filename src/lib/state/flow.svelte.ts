import type { Node, NodeEventWithPointer } from "@xyflow/svelte";

type State = {
	currNodeId: string | null;
};

export let flowState = $state<State>({ currNodeId: null });

export const handleNodeClick: NodeEventWithPointer<MouseEvent | TouchEvent, Node> = (e) => {
	if (e.node.type === "materia") {
		flowState.currNodeId = e.node.id;
	}
};

export const handlePaneClick = () => {
	flowState.currNodeId = null;
};

export const syncMateriasDesbloqueadas = () => {};
