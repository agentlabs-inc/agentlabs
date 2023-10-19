<script lang="ts">
	import { Bars3, ChevronDown, Icon } from "svelte-hero-icons";
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
	import { themeStore } from "$lib/stores/theme";
	import { authStore } from "$lib/stores/auth";
	import { mainContextStore } from "$lib/stores/main-context";
	import Button from "$lib/components/common/button/Button.svelte";
	import { leftNavStore } from "$lib/stores/left-nav";

	const member = $authStore.member;

	if (!member) {
		throw new Error("Member is not available");
	}

	const projectConfig = $mainContextStore.publicProjectConfig;

	if (!projectConfig) {
		throw new Error("projectConfig is not available");
	}

	let isDropdownVisible = false;
	const toggleDropdown = () => {
		isDropdownVisible = !isDropdownVisible;
	};
</script>

<div
	class="shrink-0 bg-background-secondary dark:bg-background-primary-dark sticky top-0 flex justify-between items-center border-b border-stroke-base dark:border-stroke-base-dark h-[60px] z-20">
	<div class="pl-5 flex items-center gap-2">
		<div class={$leftNavStore.isOpened ? "hidden" : "block"}>
			<Button
				fullHeight
				leftIcon={Bars3}
				type="none"
				size="smaller"
				on:click={$leftNavStore.toggle} />
		</div>
		<AgentLabsLogo theme={$themeStore} />
	</div>
</div>
