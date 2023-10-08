<script lang="ts">
	export let type: "info" | "success" | "error" | "warning" = "info";

	const classPerType = {
		success:
			"border-stroke-success dark:border-stroke-success-dark bg-background-success dark:bg-background-success-dark text-body-filled-success dark:text-body-filled-success-dark",
		warning:
			"border-stroke-warning dark:border-stroke-warning-dark bg-background-warning dark:bg-background-warning-dark text-body-filled-warning dark:text-body-filled-warning-dark",
		error: "border-stroke-error dark:border-stroke-error-dark bg-background-error dark:bg-background-error-dark text-body-filled-error dark:text-body-filled-error-dark",
		info: "border-stroke-info dark:border-stroke-info-dark bg-background-info dark:bg-background-info-dark text-body-filled-info dark:text-body-filled-info-dark"
	};
</script>

<div class="{classPerType[type]} rounded-full px-3 py-1 text-sm">
	<slot />
</div>
