<script lang="ts">
	type Type = "warning" | "error" | "info";
	export let type: Type;

	const typeClassMap: Record<Type, string> = {
		warning:
			"border-stroke-warning dark:border-stroke-warning-dark bg-background-warning dark:bg-background-warning-dark text-body-filled-warning dark:text-body-filled-warning-dark",
		error: "border-stroke-error dark:border-stroke-error-dark bg-background-error dark:bg-background-error-dark text-body-filled-error dark:text-body-filled-error-dark",
		info: "border-stroke-info dark:border-stroke-info-dark bg-background-info dark:bg-background-info-dark text-body-filled-info dark:text-body-filled-info-dark"
	};
</script>

<div class="{typeClassMap[type]} border-l-2 p-5 text-sm">
	<slot />
</div>
