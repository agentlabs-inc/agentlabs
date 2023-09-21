import { toast } from "@zerodevx/svelte-toast";

export const toastError = (message: string) => {
	toast.push(message, {
		theme: {
			"--toastBackground": "#ef434b",
			"--toastProgressBackground": "#ff7875"
		}
	});
};

export const toastSuccess = (message: string) => {
	toast.push(message, {
		theme: {
			"--toastBackground": "#00C48C",
			"--toastProgressBackground": "#95de64"
		}
	});
};
