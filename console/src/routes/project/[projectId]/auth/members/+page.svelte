<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Table from "$lib/components/common/table/Table.svelte";
	import dayjs from "dayjs";
	import type { TableColumn, TableRow } from "$lib/components/common/table/types";
	import type { Member } from "$lib/entities/member/member";
	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { projectStore } from "$lib/stores/project";
	import { fetchProjectMembers } from "$lib/usecases/members/fetchProjectMembers";

	import { projectAuthMethodsRoute, projectMembersRoute } from "$lib/routes/routes";
	import { onMount } from "svelte";
	import CopiableCell from "$lib/components/common/table/CopiableCell.svelte";

	let isLoadingData = false;
	const projectId = $projectStore.currentProjectId;

	if (!projectId) {
		throw new Error("Project ID is not defined");
	}

	onMount(async () => {
		isLoadingData = true;
		try {
			const result = await fetchProjectMembers({
				projectId,
				page: 1
			});

			users = result.items;
			isLoadingData = false;
		} catch (e) {
			console.error("Error while fetching members", e);
		} finally {
			isLoadingData = false;
		}
	});

	let searchValue = "";

	let users: TableRow<Member>[] = [];

	const columns: TableColumn<Member, keyof Member>[] = [
		{
			name: "ID",
			key: "id",
			customComponent: CopiableCell
		},
		{
			name: "Email",
			key: "email"
		},
		{
			name: "Name",
			key: "firstName",
			format: (member: Member) =>
				`${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() || "-"
		},
		{
			name: "Is Verified",
			key: "verifiedAt",
			format: (member: Member) => (member.verifiedAt ? "Yes" : "No")
		},
		{
			name: "Created at",
			key: "createdAt",
			format: (member: Member) => dayjs(member.createdAt).format("MMMM D, YYYY")
		}
	];

	$: navItems = $projectStore.currentProjectId
		? [
				{
					label: "Members",
					path: projectMembersRoute.path($projectStore.currentProjectId)
				},
				{
					label: "Auth methods",
					path: projectAuthMethodsRoute.path($projectStore.currentProjectId)
				}
		  ]
		: [];

	$: filteredResults = () => {
		if (!searchValue) return users;
		return users.filter((user) => {
			const search = searchValue.toLowerCase();
			return (
				user.id.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
			);
		});
	};
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 h-full flex flex-col gap-4 justify-between">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>Authentication</span>

			<TabNav items={navItems} />
		</section>
	</TopCover>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<div class="flex w-full justify-between items-center">
				<div class="w-[400px]">
					<Input
						name="search"
						placeholder="Search a user by email, ID or name"
						type="text"
						bind:value={searchValue} />
				</div>
				<!--				<Button leftIcon={PlusSmall}>Create a new user</Button>-->
			</div>
			<Spacer size="md" />

			<Table
				isLoadingData={isLoadingData}
				totalCount={users.length}
				columns={columns}
				rows={filteredResults()}
				emptyTitle="You don't have any users yet"
				emptyDescription="Share your AI Agent publicly to get your first users." />
		</div>
	</div>
</div>
