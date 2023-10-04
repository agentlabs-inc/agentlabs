<script lang="ts">
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
	import AgentContext from "$lib/context/AgentContext.svelte";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
	import RealtimeContext from "$lib/context/RealtimeContext.svelte";
</script>

<AuthOnly>
	<AgentContext>
		<RealtimeContext>
			<div class="bg-background-primary dark:bg-background-primary-dark h-screen flex flex-col">
				<TopNav />
				<div class="flex flex-row flex-grow">
					<LeftNav />
					<div class="flex-grow">
						<slot />
					</div>
				</div>
			</div>
		</RealtimeContext>
	</AgentContext>
</AuthOnly>
