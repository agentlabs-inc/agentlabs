<script lang="ts">
	import type { IconSource } from "svelte-hero-icons";
	import { Icon, ArrowPath } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";
	import type { ButtonStatus } from "$lib/components/common/button/button.types";

	const dispatch = createEventDispatcher();

	export let type: "primary" | "secondary" = "primary";
	export let leftIcon: IconSource = undefined;
	export let rightIcon: IconSource = undefined;
	export let submit = false;
	export let center = true;

	export let fullWidth = false;

	export let loading = false;

	export let disabled = false;

	const typeClassMap = {
		primary:
			"bg-button-bg-primary text-button-label-primary border border-button-stroke-primary hover:bg-button-bg-primary/90",
		secondary:
			"bg-button-bg-secondary text-button-label-secondary border border-button-stroke-secondary hover:bg-button-bg-secondary/90"
	};

	const statusClassMap: Record<ButtonStatus, string> = {
		loading: "cursor-wait opacity-50",
		disabled: "cursor-not-allowed opacity-50"
	};

	$: if (center) {
		typeClassMap[type] += " justify-center";
	}

	$: buttonStatus = (): ButtonStatus => {
		if (loading) return "loading";
		if (disabled) return "disabled";
		return "default";
	};

	$: statusClass = statusClassMap[buttonStatus()];

	$: if (fullWidth) {
		typeClassMap[type] += " w-full";
	}
</script>

<button
	on:click={(event) => dispatch("click", event)}
	type={submit ? "submit" : "button"}
	class="rounded-[3px] px-5 py-3 text-sm antialiased flex gap-2 {typeClassMap[
		type
	]} {statusClass}">
	{#if loading}
		<Icon class="inline-block animate-spin" src={ArrowPath} size="20" />
	{/if}
	{#if !!leftIcon}<Icon class="inline-block" src={leftIcon} size="20" />{/if}
	<slot />
	{#if !!rightIcon}<Icon class="inline-block" src={rightIcon} size="20" />{/if}
</button>
