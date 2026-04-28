import type { Node, NodeEventWithPointer } from "@xyflow/svelte";

type StateType = {
	selectedMateriaNodeId: string | null;
};

export let State = $state<StateType>({
	selectedMateriaNodeId: null
});

export const handleNodeClick: NodeEventWithPointer<MouseEvent | TouchEvent, Node> = (e) => {
	if (e.node.type === "materia") {
		State.selectedMateriaNodeId = e.node.id;
	}
};

export const handlePaneClick = () => {
	State.selectedMateriaNodeId = null;
};
