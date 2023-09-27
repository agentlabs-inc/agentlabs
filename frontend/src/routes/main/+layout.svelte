<script>
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
</script>

<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
	<TopNav />
	<div class="flex flex-row grow">
		<LeftNav />
		<div class="grow">
			<slot />
		</div>
	</div>
</div>
