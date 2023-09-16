<script lang="ts">
	import { Icon, DocumentDuplicate, CodeBracket } from "svelte-hero-icons";
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import type { PageData } from "$lib/types";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	export let data: PageData;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			name: zod.string().min(3).max(20)
		}),
		validationMethod: "oninput"
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex items-center gap-4">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>My super cool agent</span>
			<div
				class="bg-background-accent dark:bg-background-accent-dark flex items-center gap-2 border border-stroke-accent dark:border-stroke-accent-dark rounded-full py-1.5 px-5 text-body-base dark:text-body-base-dark text-sm antialiased">
				<Icon src={DocumentDuplicate} width="15" />
				Copy Agent ID
			</div>
		</section>
	</TopCover>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Card>
				<section class="p-10 antialiased min-h-[200px]">
					<Typography type="mainSectionTitle">Getting started</Typography>
					<Typography type="subTitle">Setup your project like a boss</Typography>
				</section>
				<section
					class="p-10 antialiased min-h-[200px] border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="sectionTitle">Integrate in your server</Typography>
							<Typography type="subTitle"
								>Our SDKs let you control your agent frontend with bidirectionnal
								streaming and even more features.</Typography>
						</div>
						<div class="col-span-3 grid grid-cols-2 gap-5">
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>NodeJS SDK</div>
							</div>
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>Python SDK</div>
							</div>
						</div>
					</div>
				</section>
			</Card>
			<Spacer size="md" />
			<Card>
				<section class="p-10 antialiased">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="sectionTitle">Rename your agent</Typography>
							<Typography type="subTitle"
								>This will change the named displayed on your UI interface.</Typography>
						</div>
						<div class="col-span-3 gap-5">
							<form on:submit={handleValidation}>
								<Input
									bind:value={$form.name}
									label="Agent name"
									required
									name="name"
									errors={$errors?.name}
									type="text"
									placeholder="Project name" />
							</form>
						</div>
					</div>
				</section>
				<Spacer size="md" />
				<section
					class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
					<div>
						<Button
							disabled={!$form.name || !!$errors?.name}
							submit
							type="primary"
							center>Update</Button>
					</div>
				</section>
			</Card>
			<Spacer size="md" />
			<Card>
				<section class="p-10 antialiased">
					<div class="flex flex-col gap-3">
						<Typography type="sectionTitle">Danger zone</Typography>
						<div
							class="border-l-2 border-stroke-warning dark:border-stroke-warning-dark p-5 bg-background-warning dark:bg-background-warning-dark text-body-warning dark:text-body-warning-dark text-sm">
							Removing an agent will instantly make it unavailable for all your users
							and result in losing all data and events related to this agent. We
							assume you know what you are doing.
						</div>
					</div>
				</section>
				<Spacer size="md" />
				<section
					class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
					<div>
						<Button
							disabled={!$form.name || !!$errors?.name}
							submit
							type="danger"
							center>Delete forever</Button>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
