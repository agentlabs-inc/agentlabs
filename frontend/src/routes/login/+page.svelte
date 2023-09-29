<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import { z as zod } from "zod";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import { verifyPasswordlessEmail } from "$lib/usecases/members/verifyPasswordlessEmail";
	import { toastError } from "$lib/utils/toast";
	import { homeRoute, registerRoute, verifyPasswordlessEmailRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { requestPasswordlessEmail } from "$lib/usecases/members/requestPasswordlessEmail";
	import { getMainContextStore } from "$lib/stores/main-context";

	export let data: PageData;

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) {
		throw new Error("Project config not found");
	}

	let submitting = false;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			email: zod.string().email()
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
			await requestPasswordlessEmail({
				projectId: projectConfig.id,
				email: $form.email
			});

			goto(verifyPasswordlessEmailRoute.path($form.email));
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
		<h1 class="text-body-accent dark:text-body-accent-dark text-4xl font-bold antialiased">
			Welcome back!
		</h1>
		<div class="my-5" />
		<div class="w-full sm:w-[320px]">
			<form on:submit={handleValidation}>
				<Input
					bind:value={$form.email}
					label="Email"
					required
					name="email"
					errors={$errors?.email}
					type="text"
					placeholder="Your email" />
				<div class="my-5" />
				<div class="w-full mb-3">
					<Button
						on:click={handleValidation}
						loading={submitting}
						submit
						type="primary"
						fullWidth
						center>Sign in</Button>
				</div>
				<span class="text-sm text-center m-auto text-body-base dark:text-body-base-dark"
					><a href="/forgot-password" class="underline">Forgot password?</a></span>
			</form>
			<div class="my-7 flex gap-5 justify-between items-center">
				<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
				<span class="text-body-base dark:text-body-base-dark text-sm antialiased">OR</span>
				<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
			</div>
			<div class="flex flex-col gap-3">
				<AuthProviderButton provider="google" />
			</div>

			<div class="text-center mt-10">
				<span class="text-sm text-center m-auto text-body-base dark:text-body-base-dark"
					>No account? <a href={registerRoute.path()} class="underline"
						>Register for free</a
					></span>
			</div>
		</div>
	</div>
</div>
