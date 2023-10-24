<script lang="ts">
	import { logoutRoute } from "$lib/routes/routes";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";
	import {
		ArrowRightOnRectangle,
		ChevronDown,
		EllipsisHorizontal,
		Icon,
		Plus
	} from "svelte-hero-icons";
	import { clickOutside } from "$lib/utils/clickOutside";
	import { createEventDispatcher } from "svelte";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import { authStore } from "$lib/stores/auth";
	import { mainContextStore } from "$lib/stores/main-context";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";

	const dispatch = createEventDispatcher();
	const onClickOutside = () => {};

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

	$: memberEmailOrName = member.email ?? "Guest";
	$: memberAvatarUrl = member.profilePictureUrl ?? "";
</script>

<div>
	<div class="flex gap-2 items-center h-[78px]">
		<div
			role="menu"
			on:click={toggleDropdown}
			on:keydown={() => {}}
			tabindex="0"
			class="relative flex w-full gap-4 border-l border-stroke-base dark:border-stroke-base-dark h-full items-center justify-between px-3 cursor-pointer">
			<div class="flex items-center justify-center gap-4">
				{#key memberAvatarUrl}
					<Avatar alt="user avatar" src={memberAvatarUrl} />
				{/key}
				<div class="antialiased flex flex-col gap-0">
					<span class="text-body-base text-sm">{memberEmailOrName}</span>
					<span class="text-body-subdued text-sm">{projectConfig.name}</span>
				</div>
			</div>
			<div class="">
				<Icon src={EllipsisHorizontal} class="w-4 h-4 text-body-subdued" />
			</div>
			<!-- Hello -->
			<div
				use:clickOutside={onClickOutside}
				class="animate-in fade-in slide-in-from-bottom-4 {isDropdownVisible
					? 'visible'
					: 'hidden'} absolute bottom-[100%] right-[px] left-[0px] w-full border-t border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-tertiary-dark">
				<section class="p-3 border-b border-stroke-base dark:border-stroke-base-dark">
					<ul class="flex flex-col gap-3 antialiased">
						<ThemeSwitch isNavItem={true} />
						{#if !member.isAnonymous}
							<NavItem
								isActive={false}
								item={{
									path: logoutRoute.path(),
									label: "Sign out",
									icon: ArrowRightOnRectangle
								}} />
						{/if}
					</ul>
				</section>
			</div>
		</div>
	</div>
</div>
