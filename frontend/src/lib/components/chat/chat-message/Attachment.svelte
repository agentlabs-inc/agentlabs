<script lang="ts">
	import bytes from 'bytes'
	import { Icon, PaperClip } from 'svelte-hero-icons'

	export let name: string;
	export let sizeBytes: number;
	export let mimeType: string;

	let isHovering = false;
</script>

<button 
	on:mouseenter={() => isHovering = true}
	on:mouseleave={() => isHovering = false}
	class="antialiased pl-2 pr-6 border border-stroke-base dark:border-stroke-base-dark py-2 rounded-lg text-white rounded-xl flex items-center bg-background-primary dark:bg-background-primary-dark">
	<div class="rounded-xl bg-stroke-base dark:bg-stroke-base-dark p-2 text-body-accent dark:text-body-accent-dark">
		<Icon class="w-5 h-5" src={PaperClip} />
	</div>

	<div class="ml-3 w-32">
			<p
				class="text-body-accent dark:text-body-accent-dark text-sm text-left text-[11pt] leading-7"
			>
				{name}
			</p>
		
			{#if isHovering}
				<div
					class="flex justify-between items-center text-body-subdued dark:text-body-subdued-dark text-xs"
				>
					Download
				</div>
			{:else}
				<div
					class="flex justify-between items-center text-body-subdued dark:text-body-subdued-dark text-xs"
				>
					<div>
						{mimeType}
					</div>
					{' '}
					<div>
						{bytes(sizeBytes)}
					</div>
				</div>
			{/if}
	</div>
</button>
