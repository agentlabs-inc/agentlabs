<script lang="ts">
	import { Icon, User } from "svelte-hero-icons";

	export let src: string;
	export let alt: string;

	const image: { src: string | null } = {
		src
	};
</script>

<div>
	{#if image.src}
		<img
			src={src}
			on:error={() => {
				image.src = null;
			}}
			alt={alt}
			class="rounded-full w-9" />
	{:else}
		<div
			class="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
			<Icon
				src={User}
				size="20"
				class="w-5 h-5 text-body-accent dark:text-body-accent-dark" />
		</div>
	{/if}
</div>
