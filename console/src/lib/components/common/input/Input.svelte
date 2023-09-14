<script lang="ts">
	export let name: string;
	export let placeholder: string;
	export let type: "text" | "email" | "password" = "text";

	export let label: string | undefined = undefined;

	export let required = false;

	export let value: string | undefined = undefined;

	export let errors: any | string[] | undefined = undefined;

	import { BellAlert, Icon } from "svelte-hero-icons";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		value = target.value;
	};

	const spacingClass = `py-4 px-6`;
	$: strokeClass = errors?.length ? "border-stroke-error" : "border-stroke-base";
</script>

<div>
	{#if !!label?.length}
		<label class="text-body-accent dark:text-body-accent-dark text-sm" for={name}
			>{label}
			{#if required}
				<span class="text-body-error dark:text-body-error-dark">*</span>
			{/if}
		</label>
	{/if}
	<input
		value={value}
		required={required}
		on:input={onInput}
		type={type}
		name={name}
		placeholder={placeholder}
		class="bg-input-bg-primary border w-full border-input-stroke-primary text-input-label-primary focus:outline-0 rounded-sm text-sm placeholder-input-label-primary {spacingClass} {strokeClass} antialiased" />
	{#if !!errors?.length}
		<div class="flex items-center gap-2 mt-1">
			<span class="text-body-error dark:text-body-error-dark text-sm">{errors[0]}</span>
		</div>
	{/if}
</div>
