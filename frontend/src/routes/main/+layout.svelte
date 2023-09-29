<script>
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
	import AgentContext from "$lib/context/AgentContext.svelte";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
</script>

<AuthOnly>
	<AgentContext>
		<div class="bg-background-primary dark:bg-background-primary-dark h-screen flex flex-col">
			<TopNav />
			<div class="flex flex-row flex-grow">
				<LeftNav />
				<div class="flex-grow">
					<slot />
				</div>
			</div>
		</div>
	</AgentContext>
</AuthOnly>
