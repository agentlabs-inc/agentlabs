<script>
	import { ChartBar, LightBulb, Icon } from "svelte-hero-icons";
	import TopNav from "$lib/components/common/top-nav/TopNav.svelte";
</script>

<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
	<TopNav />
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
