<script lang="ts">
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
	import RealtimeContext from "$lib/context/RealtimeContext.svelte";
	import Chat from "$lib/components/chat/chat.svelte";
	import AgentContext from "$lib/context/AgentContext.svelte";
</script>

<svelte:head>
	<title>Chat</title>
</svelte:head>

<AuthOnly>
	<AgentContext>
		<RealtimeContext>
			<div
				class="bg-background-primary dark:bg-background-primary-dark h-screen flex flex-col">
				<div class="flex flex-row flex-grow">
					<LeftNav />
					<div class="flex-grow flex flex-col">
						<TopNav />
						<Chat />
						<slot />
					</div>
				</div>
			</div>
		</RealtimeContext>
	</AgentContext>
</AuthOnly>
