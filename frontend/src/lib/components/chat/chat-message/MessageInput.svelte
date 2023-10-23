<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import { PaperAirplane } from "svelte-hero-icons";
	import MessageInputButton from "$lib/components/chat/chat-message/MessageInputButton.svelte";

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

	const spacingClass = `py-2 pl-4 pr-2`;
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
	<div
		class="flex gap-3 items-center bg-background-secondary dark:bg-background-secondary-dark border w-full border-stroke-base dark:border-stroke-base-dark text-body-base dark:text-body-base-dark rounded-md text-sm {spacingClass} {strokeClass} antialiased">
		<input
			id={name}
			value={value}
			required={required}
			on:input={onInput}
			type={type}
			name={name}
			placeholder={placeholder}
			class="outline-0 grow bg-background-secondary dark:bg-background-secondary-dark" />
		<MessageInputButton leftIcon={PaperAirplane} size="smaller" />
	</div>
	{#if !!errors?.length}
		<div class="flex items-center gap-2 mt-1">
			<span class="text-body-error dark:text-body-error-dark text-sm">{errors[0]}</span>
		</div>
	{/if}
</div>
