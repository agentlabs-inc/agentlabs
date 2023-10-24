<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import { z as zod } from "zod";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { toastError } from "$lib/utils/toast";
	import { organizationStore } from "$lib/stores/organization";
	import { agentOverviewRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import { createAgent } from "$lib/usecases/agents/createAgent";
	import { projectStore } from "$lib/stores/project";

	export let data: PageData;

	let submitting = false;

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("Project not found");
	}

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			name: zod.string().min(3).max(20)
		}),
		validationMethod: "oninput"
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		e.stopPropagation();

		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}

		submitting = true;
		try {
			if (!$organizationStore.currentOrganizationId) {
				return;
			}

			const agent = await createAgent({
				name: $form.name,
				projectId: project.id
			});
			goto(agentOverviewRoute.path(project.id, agent.id));
		} catch (e: any) {
			toastError(e?.message ?? "Something went wrong");
		} finally {
			submitting = false;
		}
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex items-center max-w-2xl m-auto justify-center">
			<Typography type="mainTitle">Your new agent is almost ready</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-2xl m-auto mt-[-30px] mt-10">
			<Card>
				<section class="p-10 antialiased min-h-[200px]">
					<form on:submit={handleValidation}>
						<Input
							bind:value={$form.name}
							label="Agent name"
							required
							name="name"
							errors={$errors?.name}
							type="text"
							placeholder="Agent name" />
						<div class="my-5" />
						<Alert type="info">This name will be displayed to your users</Alert>
						<div class="my-5" />
						<div class="w-full">
							<Button
								on:click={handleValidation}
								loading={submitting}
								disabled={!$form.name || !!$errors?.name}
								submit
								type="primary"
								fullWidth
								center>Create my agent</Button>
						</div>
					</form>
				</section>
			</Card>
		</div>
	</div>
</div>
