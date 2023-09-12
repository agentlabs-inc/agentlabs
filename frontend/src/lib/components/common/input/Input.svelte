<script lang="ts">
	export let id: string;
	export let placeholder: string;
	export let type: "text" | "email" | "password" = "text";

	export let value = "";

	export let error: string | undefined = undefined;

	import { BellAlert, Icon } from "svelte-hero-icons";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		dispatch("input", target.value);
	};

	const spacingClass = `py-4 px-6`;
	$: strokeClass = error?.length ? "border-stroke-error" : "border-stroke-base";
</script>

<div>
	<input
		value={value}
		on:input={onInput}
		type={type}
		id={id}
		placeholder={placeholder}
		class="bg-input-bg-primary border w-full border-input-stroke-primary text-input-label-primary focus:outline-0 rounded-sm text-sm placeholder-input-label-primary {spacingClass} {strokeClass} antialiased" />

	{#if !!error?.length}
		<div class="flex items-center gap-2 mt-1">
			<Icon src={BellAlert} class="w-3 text-icon-error" />
			<span class="text-body-color-error text-sm">{error}</span>
		</div>
	{/if}
</div>
