<script lang="ts">
	import { logoutRoute } from "$lib/routes/routes";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";
	import { ArrowRightOnRectangle, Plus } from "svelte-hero-icons";
	import { clickOutside } from "$lib/utils/clickOutside";
	import { createEventDispatcher } from "svelte";

	export let visible = false;

	const dispatch = createEventDispatcher();
	const onClickOutside = () => {
		if (visible) {
			// todo: fix this
			// dispatch("close");
		}
	};
</script>

<div
	use:clickOutside={onClickOutside}
	class="animate-in fade-in slide-down {visible
		? 'visible'
		: 'hidden'} absolute top-[100%] right-0 min-w-[300px] w-full border border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark">
	<section class="p-3 border-b border-stroke-base dark:border-stroke-base-dark">
		<ul class="flex flex-col gap-3 antialiased">
			<NavItem
				isActive={false}
				item={{
					path: logoutRoute.path(),
					label: "Sign out",
					icon: ArrowRightOnRectangle
				}} />
		</ul>
	</section>
</div>
