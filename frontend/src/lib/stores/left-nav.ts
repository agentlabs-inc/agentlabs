import { writable } from "svelte/store";

export type LeftNavStore = {
	isOpened: boolean;
	toggle: () => void;
	close: () => void;
};

export const leftNavStore = writable<LeftNavStore>({
	isOpened: true,
	close: () => {
		leftNavStore.update((theme) => {
			return {
				...theme,
				isOpened: false
			};
		});
	},
	toggle: () => {
		leftNavStore.update((theme) => {
			return {
				...theme,
				isOpened: !theme.isOpened
			};
		});
	}
});
