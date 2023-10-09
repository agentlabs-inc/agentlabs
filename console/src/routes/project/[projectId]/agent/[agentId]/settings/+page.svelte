<script lang="ts">
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import { projectStore } from "$lib/stores/project";
	import { renameAgent } from "$lib/usecases/agents/renameAgent";
	import { toastError, toastSuccess } from "$lib/utils/toast";
	import { projectOverviewRoute } from "$lib/routes/routes";
	import { agentStore } from "$lib/stores/agent";
	import { deleteAgent } from "$lib/usecases/agents/deleteAgent";
	import { goto } from "$app/navigation";

	const agent = $agentStore.currentAgent;

	if (!agent) {
		throw new Error("Agent not found");
	}

	const { form, errors, validate } = superForm(
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			name: agent.name
		},
		{
			validators: zod.object({
				name: zod.string().min(3).max(20)
			}),
			validationMethod: "oninput"
		}
	);

	let isRenaming = false;

	const handleValidation = async (e: Event) => {
		isRenaming = true;
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			isRenaming = false;
			return;
		}

		try {
			await renameAgent({
				agentId: agent.id,
				name: $form.name
			});

			toastSuccess("Agent renamed successfully");
		} catch (e: any) {
			toastError(e?.message || "Something went wrong");
		} finally {
			isRenaming = false;
		}
	};

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("Project not found");
	}

	let isDeleting = false;

	const handleDeletion = async () => {
		const confirmed = confirm("Are you sure you want to delete this agent?");
		if (!confirmed) return;
		isDeleting = true;
		try {
			await deleteAgent(agent.id);
			await goto(projectOverviewRoute.path(project.id));
		} catch (e: any) {
			toastError(e?.message || "Something went wrong");
		} finally {
			isDeleting = false;
		}
	};
</script>

<div>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Card>
				<section class="relative p-10 antialiased grid grid-cols-10">
					<div class="col-span-6">
						<Typography type="mainSectionTitle">Agent Settings</Typography>
						<Typography type="subTitle">Configure your agent like a pro.</Typography>
					</div>
				</section>
				<section
					class="p-10 antialiased border-t border-stroke-base dark:border-stroke-base-dark">
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
							on:click={handleValidation}
							loading={isRenaming}
							disabled={!$form.name || !!$errors?.name || isRenaming}
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
						<Alert type="warning">
							Removing an agent will instantly make it unavailable for all your users
							and result in losing all data and events related to this agent. We
							assume you know what you are doing.
						</Alert>
					</div>
				</section>
				<Spacer size="md" />
				<section
					class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
					<div>
						<Button
							loading={isDeleting}
							on:click={handleDeletion}
							disabled={!$form.name || !!$errors?.name}
							type="danger"
							center>Delete forever</Button>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
