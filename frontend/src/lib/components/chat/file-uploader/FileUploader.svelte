<script lang="ts">
	import { Icon, PaperClip } from "svelte-hero-icons";

export let handleFile: (file: File) => void;
export let uploadCount = 0;

let fileInput: HTMLInputElement;

const handleClick = () => {
	fileInput.click();
};


const handleFileChange = (event: any) => {
	const file = event.target?.files[0];

	if (!file) {
		return;
	}

	handleFile(file);
};


</script>

<div class="relative">
		
	<button type="button" on:click={handleClick} class="relative hover:opacity-80" title="Add attachment">
		<div class="absolute -top-2 -left-2 flex items-center justify-center w-4 h-4 text-xs bg-white text-black rounded-full">
			{#if uploadCount > 0}
				{uploadCount}
			{/if}
		</div>
		<Icon src={PaperClip} class="w-6 h-6 text-body-base dark:text-body-base-dark" />
		<input on:change={handleFileChange} hidden bind:this={fileInput} type="file" />	
	</button>
</div>
