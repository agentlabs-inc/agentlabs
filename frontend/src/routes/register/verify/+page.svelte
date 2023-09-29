<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import { z as zod } from "zod";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import { toastError } from "$lib/utils/toast";
	import { registerRoute, selectAgentRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { verifyPasswordlessEmail } from "$lib/usecases/members/verifyPasswordlessEmail";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { page } from "$app/stores";
	import { getMainContextStore } from "$lib/stores/main-context";

	export let data: PageData;

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) {
		throw new Error("Project config not found");
	}

	let email = $page.data.email;

	let submitting = false;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			code: zod.string()
		})
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}

		try {
			submitting = true;
			await verifyPasswordlessEmail({
				projectId: projectConfig.id,
				email: email,
				code: $form.code
			});

			goto(selectAgentRoute.path());
		} catch (e: any) {
			toastError(e?.message ?? "Something went wrong");
		} finally {
			submitting = false;
		}
	};
</script>

<div
	class="flex min-h-screen items-center justify-center bg-background-primary dark:bg-background-primary-dark">
	<ThemeSwitch />
	<div class="p-3 w-full flex flex-col items-center">
		<div class="max-w-md">
			<Card>
				<div class="px-10 py-14 flex items-center justify-center flex-col">
					<Typography type="mainSectionTitle">Enter your verification code</Typography>
					<Spacer size="xs" />
					<Typography type="subTitle"
						>Please enter the magic code we have sent by email to {email}
					</Typography>
					<div class="my-5" />
					<div class="w-full sm:w-[320px]">
						<form on:submit={handleValidation}>
							<Input
								bind:value={$form.code}
								label="Code"
								required
								name="code"
								errors={$errors?.code}
								type="text"
								placeholder="Verification code" />
							<div class="my-5" />
							<div class="w-full">
								<Button
									loading={submitting}
									submit
									type="primary"
									fullWidth
									center
									on:click={handleValidation}>Verify code</Button>
							</div>
						</form>

						<div class="text-center mt-10">
							<span
								class="text-sm text-center m-auto text-body-base dark:text-body-base-dark"
								>Didn't receive the code <span
									on:click={() => goto(registerRoute.path())}
									class="underline">Ask for a new one</span>
							</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>
