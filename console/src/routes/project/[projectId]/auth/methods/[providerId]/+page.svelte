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
	import { page } from "$app/stores";
	import PageSkeleton from "$lib/components/common/skeleton/PageSkeleton.svelte";
	import { onMount } from "svelte";
	import { fetchAuthMethod } from "$lib/usecases/auth-methods/fetchAuthMethod";
	import type { FetchAuthMethodResponse } from "$lib/usecases/auth-methods/fetchAuthMethod";
	import { Icon } from "svelte-hero-icons";

	const providerId = $page.params.providerId.toLowerCase();

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("Project not found");
	}

	const { form, errors, validate } = superForm($page.data.form, {
		validators: zod.object({
			clientId: zod.string().min(5),
			clientSecret: zod.string().min(5)
		}),
		validationMethod: "oninput"
	});

	$: isPageLoading = !$page.data.isLoaded;
	$: method = $page.data.authMethod;
</script>

{#if isPageLoading}
	<PageSkeleton />
{:else}
	<div>
		<div class="w-full p-10 pb-32">
			<div class="max-w-6xl m-auto mt-10">
				<Card>
					<section class="relative p-10 antialiased">
						<div class="flex items-center gap-3">
							{#if method.heroIcon}
								<Icon
									src={method.heroIcon}
									width="20"
									class="m-auto text-body-subdued dark:text-body-subdued" />
							{/if}
							{#if method.componentIcon}
								<svelte:component this={method.componentIcon} />
							{/if}
							<Typography type="mainSectionTitle">{method.name}</Typography>
						</div>
					</section>
					{#if method.type === "OAUTH2"}
						<section
							class="p-10 antialiased border-t border-stroke-base dark:border-stroke-base-dark">
							<div class="grid grid-cols-5 gap-10">
								<div class="col-span-2">
									<Typography type="sectionTitle">App credentials</Typography>
									<Typography type="subTitle"
										>Enter the credentials of your OAuth Provider.
									</Typography>
								</div>
								<div class="col-span-3 gap-5">
									<form on:submit={() => {}}>
										<Input
											bind:value={$form.clientId}
											label="Client ID"
											required
											name="clientId"
											errors={$errors?.clientId}
											type="text"
											placeholder="Your client ID" />
										<Spacer size="sm" />
										<Input
											bind:value={$form.clientSecret}
											label="Client Secret"
											required
											type="password"
											name="clientSecret"
											errors={$errors?.clientSecret}
											placeholder="Your client secret" />
									</form>
								</div>
							</div>
						</section>
					{/if}
					<Spacer size="md" />
					<section
						class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
						<div>
							<Button on:click={() => {}} submit type="primary" center>Update</Button>
						</div>
					</section>
				</Card>
				<Spacer size="md" />
				<Card>
					<section class="p-10 antialiased">
						<div class="flex flex-col gap-3">
							<Typography type="sectionTitle">Danger zone</Typography>
							<Alert type="warning">
								Removing an agent will instantly make it unavailable for all your
								users and result in losing all data and events related to this
								agent. We assume you know what you are doing.
							</Alert>
						</div>
					</section>
					<Spacer size="md" />
					<section
						class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
						<div>
							<Button
								on:click={() => {}}
								disabled={!$form.name || !!$errors?.name}
								type="danger"
								center>Delete forever</Button>
						</div>
					</section>
				</Card>
			</div>
		</div>
	</div>
{/if}
