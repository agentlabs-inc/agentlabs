<script>
	import { theme } from "$lib/store/theme";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
</script>

<div
	class="bg-background-secondary dark:bg-background-primary-dark sticky top-0 flex justify-between items-center px-5 border-b border-stroke-base dark:border-stroke-base-dark h-[60px]">
	<AgentLabsLogo theme={$theme} />
	<div class="flex gap-2 items-center h-full">
		<ThemeSwitch />
		<div
			class="flex gap-4 border-l border-stroke-base dark:border-stroke-base-dark h-full items-center justify-center px-3">
			<Avatar
				alt="user avatar"
				src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
			<div class="antialiased flex flex-col gap-0">
				<span class="text-body-subdued text-sm">Kevin</span>
				<span class="text-body-base text-sm">My Organization</span>
			</div>
		</div>
	</div>
</div>
