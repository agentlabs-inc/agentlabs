<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Table from "$lib/components/common/table/Table.svelte";
	import { PlusSmall } from "svelte-hero-icons";
	import dayjs from "dayjs";
	import type { TableColumn, TableRow } from "$lib/components/common/table/types";
	import type { Member } from "$lib/entities/member/member";
	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { projectStore } from "$lib/stores/project";

	import { projectAuthMethodsRoute, projectMembersRoute } from "$lib/routes/routes";
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 h-full flex flex-col gap-4 justify-between">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>Authentication</span>

			<TabNav
				items={[
					{
						label: "Members",
						path: projectMembersRoute.path($projectStore.currentProjectId)
					},
					{
						label: "Auth methods",
						path: projectAuthMethodsRoute.path($projectStore.currentProjectId)
					}
				]} />
		</section>
	</TopCover>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Spacer size="md" />

			<h1>Work in progress</h1>
		</div>
	</div>
</div>
