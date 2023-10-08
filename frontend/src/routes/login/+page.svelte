<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { LayoutData, PageData } from "./$types";
	import { z as zod } from "zod";
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import { toastError } from "$lib/utils/toast";
	import {
		loginRoute,
		registerRoute,
		selectAgentRoute,
		verifyPasswordlessEmailRoute
	} from "$lib/routes/routes";
	import { requestPasswordlessEmail } from "$lib/usecases/members/requestPasswordlessEmail";
	import { goto } from "$app/navigation";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { getMainContextStore } from "$lib/stores/main-context";

	export let data: PageData;

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) throw new Error("Project config not found");

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

	$: isPasswordlessEmailActivated = !!projectConfig?.authMethods.find(
		(m) => m.provider === "PASSWORDLESS_EMAIL"
	);
	$: isGoogleActivated = !!projectConfig?.authMethods.find((m) => m.provider === "GOOGLE");
	$: isAnyOAuthMethodActivated = isGoogleActivated;

	$: auth2Methods = projectConfig?.authMethods.filter((m) => m.type == "OAUTH2") ?? [];
</script>

<div
	class="flex min-h-screen items-center justify-center bg-background-primary dark:bg-background-primary-dark">
	<ThemeSwitch />
	<div class="p-3 w-full flex flex-col items-center">
		<div class="max-w-md">
			<Card>
				<div class="px-10 py-14 flex items-center justify-center flex-col">
					<div class="text-center">
						<Typography type="mainTitle">Welcome Back!</Typography>
						<Spacer size="sm" />
						{#if isPasswordlessEmailActivated}
							<div class="text-center">
								<Typography type="subTitle"
									>Enter your email to get a one-time code and start using the
									Agent.</Typography>
							</div>
							<Spacer size="sm" />
						{:else}
							<div class="text-center">
								<Typography type="subTitle"
									>Sign-in to access your agent</Typography>
							</div>
							<Spacer size="sm" />
						{/if}
					</div>
					<div class="w-full sm:w-[320px]">
						{#if isPasswordlessEmailActivated}
							<Spacer size="sm" />
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
								<div class="w-full">
									<Button
										loading={submitting}
										submit
										type="primary"
										fullWidth
										center
										on:click={handleValidation}>Sign Up</Button>
								</div>
							</form>
						{/if}
						{#if isAnyOAuthMethodActivated && isPasswordlessEmailActivated}
							<div class="my-7 flex gap-5 justify-between items-center">
								<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
								<span
									class="text-body-base dark:text-body-base-dark text-sm antialiased"
									>OR</span>
								<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
							</div>
						{/if}
						{#if !isPasswordlessEmailActivated}
							<Spacer size="sm" />
						{/if}

						{#each auth2Methods as authMethod}
							<div class="flex flex-col">
								<AuthProviderButton
									authMethod={authMethod}
									provider={authMethod.provider} />
							</div>
						{/each}

						<div class="text-center mt-10">
							<span
								class="text-sm text-center m-auto text-body-base dark:text-body-base-dark"
								>No account? <a href={registerRoute.path()} class="underline"
									>Register for free</a
								></span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>
