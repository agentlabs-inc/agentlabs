<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import { getAgentById } from "$lib/stores/agent";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { superForm, superValidateSync } from "sveltekit-superforms/client";
	import { z as zod } from "zod";
	import { toastError } from "$lib/utils/toast";
	import { requestPasswordlessEmail } from "$lib/usecases/members/requestPasswordlessEmail";
	import { getMainContextStore } from "$lib/stores/main-context";
	import TypingLoader from "$lib/components/chat/chat-message/TypingLoader.svelte";
	import type { ChatMessageFormat } from "$lib/stores/chat";
	import { onMount } from "svelte";
	import { verifyPasswordlessEmail } from "$lib/usecases/members/verifyPasswordlessEmail";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { goto } from "$app/navigation";
	import { agentChatRoute } from "$lib/routes/routes";

	export let time: string;
	export let format: ChatMessageFormat;
	export let body: string;
	export let agentId: string;

	let showTypingLoader = false;

	let bubbleClass: string;

	$: bubbleClass = "bg-background-secondary dark:bg-[#282833]";

	const agent = getAgentById(agentId);

	$: letter = agent ? agent.name[0] + agent.name[1] : "?";

	if (!agent) {
		throw new Error("Agent not found");
	}

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) throw new Error("Project config not found");

	let submitting = false;

	const emailFormSchema = zod.object({
		email: zod.string().email()
	});

	const confirmationCodeSchema = zod.object({
		code: zod.string()
	});

	const {
		form: emailForm,
		errors: emailErrors,
		validate: emailValidate
	} = superForm(superValidateSync(emailFormSchema), {
		SPA: true,
		validators: emailFormSchema
	});

	const {
		form: codeForm,
		errors: codeErrors,
		validate: codeValidate
	} = superForm(superValidateSync(confirmationCodeSchema), {
		SPA: true,
		validators: confirmationCodeSchema
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		e.stopPropagation();

		const res = await emailValidate();

		if (!res.valid) {
			emailErrors.set(res.errors);
			return;
		}

		try {
			submitting = true;
			await requestPasswordlessEmail({
				projectId: projectConfig.id,
				email: $emailForm.email
			});

			displayVerifyEmailInput = true;
		} catch (e: any) {
			toastError(e?.message ?? "Something went wrong");
		} finally {
			submitting = false;
		}
	};

	const handleConfirmationCode = async (e: Event) => {
		e.preventDefault();
		e.stopPropagation();

		const res = await codeValidate();

		if (!res.valid) {
			codeErrors.set(res.errors);
			return;
		}

		try {
			submitting = true;
			await verifyPasswordlessEmail({
				projectId: projectConfig.id,
				email: $emailForm.email,
				code: $codeForm.code
			});

			// Important to reload the entire state.
			await goto(agentChatRoute.path()).then(() => {
				window.location.reload();
			});

			displayVerifyEmailInput = false;
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

	let displayVerifyEmailInput = false;

	onMount(() => {
		showTypingLoader = true;
		setTimeout(() => {
			showTypingLoader = false;
		}, 1000);
	});
</script>

<div class="{bubbleClass} rounded-md py-5 px-5 antialiased">
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0" title={agent.name}>
				<LetterAvatar>{letter}</LetterAvatar>
			</div>

			<div class="flex flex-col flex-grow relative overflow-x-scroll">
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time} - {agent.name}
				</div>
				<div
					class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7 w-full">
					{#if showTypingLoader}
						<div class="">
							<TypingLoader />
						</div>
					{:else if format === "MARKDOWN"}
						<MarkdownRenderer source={body} />
					{:else}
						{body}
					{/if}
				</div>
				{#if !showTypingLoader}
					<div
						class="animate-in fade-in mt-3 max-w-[400px] bg-background-primary border border-stroke-base dark:bg-background-primary-dark dark:border-stroke-base-dark rounded-lg">
						<div>
							<div class="px-10 py-10 flex items-center justify-center flex-col">
								<div class="w-full sm:w-[320px]">
									{#if isPasswordlessEmailActivated && !displayVerifyEmailInput}
										<form on:submit={handleValidation}>
											<Input
												bind:value={$emailForm.email}
												label="Email"
												required
												name="email"
												errors={$emailErrors?.email}
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
													on:click={handleValidation}
													>Request code</Button>
											</div>
										</form>
									{/if}
									{#if isPasswordlessEmailActivated && displayVerifyEmailInput}
										<div class="flex items-center justify-center flex-col">
											<div class="text-center">
												<Typography type="mainSectionTitle"
													>Verification code</Typography>
												<Spacer size="xs" />
												<Typography type="subTitle"
													>Please enter the code we have sent by email to {$emailForm.email}
												</Typography>
											</div>

											<div class="my-5" />
											<div class="w-full sm:w-[320px]">
												<form on:submit={handleConfirmationCode}>
													<Input
														bind:value={$codeForm.code}
														label="Code"
														required
														name="code"
														errors={$codeErrors?.code}
														type="text"
														placeholder="Verification code" />
													<div class="my-5" />
													<div class="w-full">
														<Button
															loading={submitting}
															submit
															type="primary"
															fullWidth
															center>Verify code</Button>
													</div>
												</form>

												<div class="text-center mt-10">
													<span
														class="text-sm text-center m-auto text-body-base dark:text-body-base-dark"
														>Didn't receive the code? <span
															class="underline cursor-pointer"
															on:click={() => {
																displayVerifyEmailInput = false;
															}}>Ask for a new one</span>
													</span>
												</div>
											</div>
										</div>
									{/if}
									{#if isAnyOAuthMethodActivated && isPasswordlessEmailActivated}
										<div class="my-7 flex gap-5 justify-between items-center">
											<hr
												class="border-stroke-base dark:border-stroke-base-dark grow" />
											<span
												class="text-body-base dark:text-body-base-dark text-sm antialiased"
												>OR</span>
											<hr
												class="border-stroke-base dark:border-stroke-base-dark grow" />
										</div>
									{/if}

									{#each auth2Methods as authMethod}
										<div class="flex flex-col">
											<AuthProviderButton
												authMethod={authMethod}
												provider={authMethod.provider} />
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
