<script>
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
</script>

<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
	<TopNav />
	<div>
		<slot />
	</div>
</div>
