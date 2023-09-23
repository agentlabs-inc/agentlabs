<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import { z as zod } from "zod";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { createProject } from "$lib/usecases/projects/create";
	import { toastError } from "$lib/utils/toast";
	import slugify from "slugify";
	import { organizationStore } from "$lib/stores/organization";
	import { projectOnboardingAuthMethodRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";

	export let data: PageData;

	let submitting = false;

	$: slug = $form.name ? slugify($form.name).toLowerCase() : "my-project-id";

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

		console.log(res);

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}

		submitting = true;
		try {
			const project = await createProject({
				name: $form.name,
				slug: slug,
				organizationId: $organizationStore.currentOrganizationId
			});
			goto(projectOnboardingAuthMethodRoute.path(project.id));
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
			<Typography type="mainTitle">Create your first project</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-2xl m-auto mt-[-30px] mt-10">
			<Card>
				<section class="p-10 antialiased min-h-[200px]">
					<form on:submit={handleValidation}>
						<Input
							bind:value={$form.name}
							label="Project name"
							required
							name="name"
							errors={$errors?.name}
							type="text"
							placeholder="Project name" />
						<div class="my-5" />
						<div
							class="inline-block bg-background-accent dark:bg-background-accent-dark border border-stroke-accent dark:border-stroke-accent-dark rounded-full px-4 py-2 antialiased text-body-base dark:text-body-base-dark text-sm">
							<span>Project ID: {slug}</span>
						</div>
						<div class="my-5" />
						<div class="w-full">
							<Button
								on:click={handleValidation}
								loading={submitting}
								disabled={!$form.name || !!$errors?.name}
								submit
								type="primary"
								fullWidth
								center>Create project</Button>
						</div>
					</form>
				</section>
			</Card>
		</div>
	</div>
</div>
