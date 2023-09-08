<script lang="ts">
	export let position: "right" | "left";

	$: borderClass = position === "right" ? "border-l" : "border-r";
</script>

<div class="relative min-h-full w-full border-stroke-primary {borderClass}">
	<div class="sticky top-0">
		<slot />
	</div>
</div>
