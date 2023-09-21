<script>
	import TopNav from "$lib/components/common/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/left-nav/LeftNav.svelte";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
</script>

<AuthOnly>
	<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
		<TopNav />
		<div class="flex flex-row grow">
			<LeftNav />
			<div class="grow">
				<slot />
			</div>
		</div>
	</div>
</AuthOnly>
