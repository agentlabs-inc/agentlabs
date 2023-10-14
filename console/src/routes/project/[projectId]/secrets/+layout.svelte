<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 h-full flex flex-col gap-4 justify-between">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>Secrets</span>
		</section>
	</TopCover>
	<slot />
</div>
