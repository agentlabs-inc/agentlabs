<script lang="ts">
	import { authStore, getCurrentUser } from "$lib/stores/auth";
	import { projectStore } from "$lib/stores/project";
	import { ChevronDown, Icon } from "svelte-hero-icons";
	import TopNavDropdown from "$lib/components/common/navigation/top-nav/TopNavDropdown.svelte";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
	import { themeStore } from "$lib/stores/theme";

	$: projectName = $projectStore.currentProject?.name ?? "No Project Selected";

	const user = $authStore.user;

	let isDropdownVisible = false;
	const toggleDropdown = () => {
		isDropdownVisible = !isDropdownVisible;
	};
</script>

<div
	class="bg-background-secondary dark:bg-background-primary-dark sticky top-0 flex justify-between items-center border-b border-stroke-base dark:border-stroke-base-dark h-[60px] z-20">
	<div class="pl-5">
		<AgentLabsLogo theme={$themeStore} />
	</div>
	<div class="flex gap-2 items-center h-full">
		<ThemeSwitch />
		<div
			role="menu"
			on:click={toggleDropdown}
			on:keydown={() => {}}
			tabindex="0"
			class="relative flex gap-4 border-l border-stroke-base dark:border-stroke-base-dark h-full items-center justify-center px-3 cursor-pointer">
			<Avatar alt="user avatar" src={user?.profilePictureUrl ?? ""} />
			<div class="antialiased flex flex-col gap-0">
				<span class="text-body-base text-sm">{user?.email ?? "guest"}</span>
				<span class="text-body-subdued text-sm">{projectName}</span>
			</div>
			<div class="">
				<Icon src={ChevronDown} class="w-4 h-4 text-body-subdued" />
			</div>
			<TopNavDropdown on:close={toggleDropdown} visible={isDropdownVisible} />
		</div>
	</div>
</div>
