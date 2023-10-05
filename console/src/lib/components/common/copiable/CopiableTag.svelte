<script>
	import { DocumentDuplicate, DocumentCheck, Icon } from "svelte-hero-icons";
	import { onMount } from "svelte";

	export let value = "";
	export let displayedValue = "";

	let isCopied = false;

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 1500);
	};

	onMount(() => {
		if (!displayedValue) {
			displayedValue = value;
		}
	});
</script>

<button
	on:click={handleCopy}
	class="bg-background-accent dark:bg-background-accent-dark flex items-center gap-2 border border-stroke-accent dark:border-stroke-accent-dark rounded-full py-1.5 px-5 text-body-base dark:text-body-base-dark text-sm antialiased cursor-pointer max-w-full">
	{#if !isCopied}
		<Icon src={DocumentDuplicate} width="15" class="shrink-0" />
	{:else}
		<Icon src={DocumentCheck} width="15" class="shrink-0" />
	{/if}
	<span class="truncate">{displayedValue}</span>
</button>
