import { writable } from "svelte/store";

function createChat() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		interrupt: () => {
			alert("Agent has been interrupted!");
		},
		continue: () => {
			alert("Human triggered continue.");
		},
		activateContinuous: () => {
			alert("Continuous mode activated");
		}
	};
}

export const chat = createChat();
