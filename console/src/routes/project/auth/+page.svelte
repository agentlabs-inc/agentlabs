<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Table from "$lib/components/common/table/Table.svelte";

	import { User } from "$lib/entities/user/user";

	import { PlusSmall } from "svelte-hero-icons";

	let searchValue = "";

	let users = [
		new User({
			id: "123456789",
			name: "John Doe",
			email: "john@doe.com",
			createdAt: new Date()
		}),
		new User({
			id: "123456789",
			name: "John Doe",
			email: "john@doe.com",
			createdAt: new Date()
		}),
		new User({
			id: "123456789",
			name: "John Doe",
			email: "john@doe.com",
			createdAt: new Date()
		})
	];
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 h-full flex flex-col gap-4 justify-between">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>Authentication</span>

			<div class="flex gap-3">
				<span
					class="text-sm text-body-accent dark:text-body-accent-dark py-2 px-2 cursor-pointer border-b-2 border-stroke-accent dark:border-stroke-accent-dark border-inset"
					>Users</span>
				<span
					class="text-sm text-body-base dark:text-body-base-dark py-2 px-2 cursor-pointer hover:border-b-2 border-stroke-accent dark:border-stroke-accent-dark border-inset"
					>Sign in methods</span>
				<span
					class="text-sm text-body-base dark:text-body-base-dark py-2 px-2 cursor-pointer hover:border-b-2 border-stroke-accent dark:border-stroke-accent-dark border-inset"
					>Portal Settings</span>
			</div>
		</section>
	</TopCover>
	<div class="w-full">
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

			<Table
				totalCount={3}
				columns={[
					{
						name: "Name",
						key: "name"
					},
					{
						name: "Email",
						key: "email"
					},
					{
						name: "Is Verified",
						key: "isVerified"
					},
					{
						name: "ID",
						key: "id"
					},
					{
						name: "Created at",
						key: "createdAtForHuman"
					}
				]}
				rows={users} />
		</div>
	</div>
</div>
