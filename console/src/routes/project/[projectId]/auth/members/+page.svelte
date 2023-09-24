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

	import { page } from "$app/stores";
	import { projectAuthMethodsRoute, projectMembersRoute } from "$lib/routes/routes";

	let searchValue = "";

	let users: TableRow<Member>[] = [
		{
			id: "123456789",
			fullName: "John Doe",
			email: "john@doe.com",
			verifiedAt: null,
			createdAt: new Date()
		},
		{
			id: "123456789",
			fullName: "John Doe",
			email: "john@doe.com",
			verifiedAt: null,
			createdAt: new Date()
		},
		{
			id: "123456789",
			fullName: "John Doe",
			email: "john@doe.com",
			verifiedAt: null,
			createdAt: new Date()
		}
	];

	const columns: TableColumn<Member, keyof Member>[] = [
		{
			name: "Name",
			key: "fullName"
		},
		{
			name: "Email",
			key: "email"
		},
		{
			name: "Is Verified",
			key: "verifiedAt",
			format: (member: Member) => (member.verifiedAt ? "Yes" : "No")
		},
		{
			name: "ID",
			key: "id"
		},
		{
			name: "Created at",
			key: "createdAt",
			format: (member: Member) => dayjs(member.createdAt).format("MMMM D, YYYY")
		}
	];
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
			<div class="flex w-full justify-between items-center">
				<div class="w-[400px]">
					<Input
						name="search"
						placeholder="Search a user by email, ID or name"
						type="text"
						bind:value={searchValue} />
				</div>
				<Button leftIcon={PlusSmall}>Create a new user</Button>
			</div>
			<Spacer size="md" />

			<Table totalCount={3} columns={columns} rows={users} />
		</div>
	</div>
</div>
