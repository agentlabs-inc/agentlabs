<script lang="ts">
	import type { IconSource } from "svelte-hero-icons";
	import { Icon, ArrowPath } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";
	import type { ButtonStatus } from "$lib/components/common/button/button.types";

	const dispatch = createEventDispatcher();

	type ButtonSize = "default" | "mini" | "smaller" | "bigger";
	export let type: "primary" | "secondary" | "danger" | "none" = "primary";
	export let leftIcon: IconSource = undefined;
	export let rightIcon: IconSource = undefined;
	export let submit = false;
	export let center = true;
	export let size: ButtonSize = "default";
	export let fullWidth = false;

	export let fullHeight = false;
	export let loading = false;
	export let disabled = false;

	const typeClassMap = {
		primary:
			"bg-button-bg-primary text-button-label-primary border border-button-stroke-primary hover:bg-button-bg-primary/90",
		secondary:
			"bg-button-bg-secondary text-button-label-secondary border border-button-stroke-secondary hover:bg-button-bg-secondary/90",
		danger: "bg-button-bg-destructive text-button-label-destructive border border-button-stroke-destructive hover:bg-button-bg-destructive/90",
		none: "bg-transparent text-body-base dark:text-body-base-dark"
	};

	const statusClassMap: Record<ButtonStatus, string> = {
		loading: "cursor-wait opacity-50",
		disabled: "cursor-not-allowed opacity-50"
	};

	const buttonSizeClassMap: Record<ButtonSize, string> = {
		mini: "text-xs px-2 py-2",
		smaller: "text-sm px-2 py-2",
		default: "text-sm px-5 py-3",
		bigger: "text-md px-6 py-4"
	};

	const iconSizeMap: Record<ButtonSize, string> = {
		mini: "12",
		smaller: "16",
		default: "20",
		bigger: "25"
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
		typeClassMap[type] += ` w-full`;
	}

	$: if (fullHeight) {
		typeClassMap[type] += ` h-full`;
	}

	$: sizeClass = buttonSizeClassMap[size];

	const handleClick = (e: Event) => {
		if (disabled) return;

		dispatch("click", e);
	};
</script>

<button
	on:click={handleClick}
	disabled={disabled}
	type={submit ? "submit" : "button"}
	class="rounded-md antialiased flex gap-2 items-center {typeClassMap[
		type
	]} {statusClass} {sizeClass}">
	{#if loading}
		<Icon class="inline-block animate-spin" src={ArrowPath} size={iconSizeMap[size]} />
	{/if}
	{#if !!leftIcon}<Icon class="inline-block" src={leftIcon} size={iconSizeMap[size]} />{/if}
	<slot />
	{#if !!rightIcon && !loading}
		<div class="h-full flex items-center justify-center">
			<Icon class="inline-block" src={rightIcon} size={iconSizeMap[size]} />
		</div>{/if}
</button>
