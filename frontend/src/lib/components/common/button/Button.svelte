<script lang="ts">
	import type { IconSource } from "svelte-hero-icons";
	import { Icon } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let type: "primary" | "secondary" = "primary";
	export let leftIcon: IconSource = undefined;
	export let rightIcon: IconSource = undefined;
	export let submit = false;
	export let center = false;

	$: typeClassMap = {
		primary:
			"bg-button-bg-primary text-button-label-primary border border-button-stroke-primary hover:bg-button-bg-primary/90",
		secondary:
			"bg-button-bg-secondary text-button-label-secondary border border-button-stroke-secondary hover:bg-button-bg-secondary/90"
	};

	$: if (center) {
		typeClassMap[type] += " justify-center";
	}
</script>

<button
	on:click={(event) => dispatch("click", event)}
	type={submit ? "submit" : "button"}
	class="rounded-[3px] px-5 py-3 text-sm antialiased flex gap-2 w-full {typeClassMap[type]}">
	{#if !!leftIcon}<Icon class="inline-block" src={leftIcon} size="20" />{/if}
	<slot />
	{#if !!rightIcon}<Icon class="inline-block" src={rightIcon} size="20" />{/if}
</button>
