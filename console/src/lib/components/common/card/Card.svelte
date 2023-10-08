<script lang="ts">
	export let clickable = false;
	export let disabled = false;

	const clickableClass = clickable ? "cursor-pointer hover:shadow-xl transition-shadow" : "";
	const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
	// import svelte event dispatcher and dispatch onclick event
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	const handleClick = () => {
		if (clickable) {
			dispatch("click");
		}
	};
</script>

<div
	role={clickable ? "button" : ""}
	tabindex="0"
	on:click={handleClick}
	on:keydown={() => {}}
	class="{clickableClass} {disabledClass} w-full rounded-2xl border border-stroke-base dark:border-stroke-base-dark bg-background-tertiary dark:bg-background-tertiary-dark">
	<slot />
</div>
