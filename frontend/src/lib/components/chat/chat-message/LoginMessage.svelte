<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import { getAgentById } from "$lib/stores/agent";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import { z as zod } from "zod";
	import { toastError } from "$lib/utils/toast";
	import { verifyPasswordlessEmailRoute } from "$lib/routes/routes";
	import { requestPasswordlessEmail } from "$lib/usecases/members/requestPasswordlessEmail";
	import { goto } from "$app/navigation";
	import { getMainContextStore } from "$lib/stores/main-context";
	import TypingLoader from "$lib/components/chat/chat-message/TypingLoader.svelte";
	import type { ChatMessageFormat } from "$lib/stores/chat";
	import { onMount } from "svelte";

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

	const { form, errors, validate } = superForm(
		{
			email: ""
		}, // TODO: add form instance
		{
			validators: zod.object({
				email: zod.string().email()
			})
		}
	);

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
									{#if isPasswordlessEmailActivated}
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
													on:click={handleValidation}
													>Request code</Button>
											</div>
										</form>
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
