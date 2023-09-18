<script lang="ts">
	export let name: string;
	export let placeholder: string;
	export let type: "text" | "email" | "password" = "text";

	export let label: string | undefined = undefined;

	export let required = false;

	export let value: string | undefined = undefined;

	export let errors: any | string[] | undefined = undefined;

	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		value = target.value;
	};

	const spacingClass = `py-4 px-6`;
	$: strokeClass = errors?.length ? "border-stroke-error" : "border-stroke-base";
</script>

<div>
	{#if !!label?.length}
		<label
			class="text-body-accent dark:text-body-accent-dark text-sm inline-block mb-2"
			for={name}
			>{label}
			{#if required}
				<span class="text-body-error dark:text-body-error-dark">*</span>
			{/if}
		</label>
	{/if}
	<input
		id={name}
		value={value}
		required={required}
		on:input={onInput}
		type={type}
		name={name}
		placeholder={placeholder}
		class="bg-background-secondary dark:bg-background-secondary-dark border w-full border-stroke-base dark:border-stroke-base-dark text-body-base dark:text-body-base-dark focus:outline-0 rounded-sm text-sm {spacingClass} {strokeClass} antialiased" />
	{#if !!errors?.length}
		<div class="flex items-center gap-2 mt-1">
			<span class="text-body-error dark:text-body-error-dark text-sm">{errors[0]}</span>
		</div>
	{/if}
</div>
