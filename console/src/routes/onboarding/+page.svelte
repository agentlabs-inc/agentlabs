<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import type { PageData } from "./$types";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
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
						<div class="w-full">
							<Button
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
