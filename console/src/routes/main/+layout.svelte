<script>
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import { ChartBar, LightBulb, Icon } from "svelte-hero-icons";
	import { theme } from "$lib/store/theme";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
</script>

<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
	<div
		class="bg-background-secondary dark:bg-background-primary-dark sticky flex justify-between items-center px-5 border-b border-stroke-base dark:border-stroke-base-dark h-[60px]">
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
	<div class="flex flex-row grow">
		<div
			class="sticky top-0 min-h-full border-r border-stroke-base dark:border-stroke-base-dark w-[200px] bg-background-secondary dark:bg-background-primary-dark">
			<section class="p-5">
				<ul class="flex flex-col gap-3 antialiased">
					<li
						class="text-sm text-body-base dark:text-body-base-dark py-3 px-4 bg-background-accent dark:bg-background-accent-dark rounded-lg flex gap-2 items-center cursor-pointer">
						<Icon src={ChartBar} class="w-4" />
						Overview
					</li>
					<li
						class="text-sm text-body-base dark:text-body-base-dark py-3 px-4 hover:bg-background-accent dark:hover:bg-background-accent-dark rounded-lg flex gap-2 items-center cursor-pointer">
						<Icon src={LightBulb} class="w-4" />
						Overview
					</li>
					<li
						class="text-sm text-body-base dark:text-body-base-dark py-3 px-4 hover:bg-background-accent dark:hover:bg-background-accent-dark rounded-lg flex gap-2 items-center cursor-pointer">
						<Icon src={ChartBar} class="w-4" />
						Overview
					</li>
				</ul>
			</section>
		</div>
		<div class="grow">
			<slot />
		</div>
	</div>
</div>
