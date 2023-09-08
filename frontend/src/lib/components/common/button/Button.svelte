<script lang="ts">
	import type { IconSource } from "svelte-hero-icons";
	import { Icon } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let type: "primary" | "secondary" = "primary";
	export let leftIcon: IconSource = undefined;
	export let rightIcon: IconSource = undefined;

	$: typeClassMap = {
		primary:
			"bg-button-bg-primary text-button-label-primary border border-button-stroke-primary",
		secondary:
			"bg-button-bg-secondary text-button-label-secondary border border-button-stroke-secondary"
	};
</script>

<button
	on:click={(event) => dispatch("click", event)}
	class="rounded-[3px] px-5 py-3 text-sm antialiased flex gap-2 items-center {typeClassMap[
		type
	]}">
	{#if !!leftIcon}<Icon class="inline-block" src={leftIcon} size="20" />{/if}
	<slot />
	{#if !!rightIcon}<Icon class="inline-block" src={rightIcon} size="20" />{/if}
</button>
