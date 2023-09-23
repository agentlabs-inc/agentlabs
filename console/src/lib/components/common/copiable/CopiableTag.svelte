<script>
	import { DocumentDuplicate, DocumentCheck, Icon } from "svelte-hero-icons";

	export let value = "";
	let isCopied = false;

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 1500);
	};
</script>

<button
	on:click={handleCopy}
	class="bg-background-accent dark:bg-background-accent-dark flex items-center gap-2 border border-stroke-accent dark:border-stroke-accent-dark rounded-full py-1.5 px-5 text-body-base dark:text-body-base-dark text-sm antialiased cursor-pointer">
	{#if !isCopied}
		<Icon src={DocumentDuplicate} width="15" />
	{:else}
		<Icon src={DocumentCheck} width="15" />
	{/if}
	{value}
</button>
