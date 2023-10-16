<script lang="ts">
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { projectStore } from "$lib/stores/project";
	import { page } from "$app/stores";
	import PageSkeleton from "$lib/components/common/skeleton/PageSkeleton.svelte";
	import { ArrowLeft, Icon } from "svelte-hero-icons";
	import { toastError, toastSuccess } from "$lib/utils/toast";
	import { upsertAuthMethod } from "$lib/usecases/auth-methods/upsert";
	import Switch from "$lib/components/common/switch/Switch.svelte";
	import { goto } from "$app/navigation";
	import { projectAuthMethodsRoute } from "$lib/routes/routes";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";
	import { env } from "$env/dynamic/public";
	import { validateEnv } from "$lib/utils/validateEnv";

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("Project not found");
	}

	const environment = validateEnv(env);

	if (!environment) {
		throw new Error("Environment not found");
	}

	const redirectUri =
		`https://${project.slug}.${environment.PUBLIC_AI_AGENT_DOMAIN}/auth/handler/${$page.data.authMethod.providerId}`.toLowerCase();

	const { form, errors, validate } = superForm($page.data.form, {
		validators: zod.object({
			clientId: zod.string().min(5),
			clientSecret: zod.string().min(5),
			isEnabled: zod.boolean()
		}),
		validationMethod: "oninput"
	});

	$: isPageLoading = !$page.data.isLoaded;
	$: method = $page.data.authMethod;

	let isSaving = false;

	const handleSave = async (e: Event) => {
		isSaving = true;
		e.preventDefault();
		const res = await validate();

		if ($page.data.authMethod.type === "OAUTH2") {
			if (!res.valid) {
				errors.set(res.errors);
				isSaving = false;
				return;
			}
		}

		try {
			await upsertAuthMethod({
				clientId: res.data.clientId,
				clientSecret: res.data.clientSecret,
				provider: $page.data.authMethod.providerId,
				projectId: project.id,
				isEnabled: res.data.isEnabled,
				scopes: []
			});
			toastSuccess("Auth method saved!");
		} catch (e: any) {
			toastError(e.message ?? "Something went wrong");
		} finally {
			isSaving = false;
		}
	};
</script>

{#if isPageLoading}
	<PageSkeleton />
{:else}
	<div>
		<div class="w-full p-10 pb-32">
			<Button
				type="secondary"
				leftIcon={ArrowLeft}
				on:click={() => goto(projectAuthMethodsRoute.path(project.id))}>Back</Button>
			<div class="max-w-6xl m-auto mt-10">
				<Card>
					<section class="relative p-10 antialiased">
						<div class="flex items-center gap-3">
							{#if method.heroIcon}
								<div>
									<Icon
										src={method.heroIcon}
										width="20"
										class="m-auto text-body-subdued dark:text-body-subdued flex-0" />
								</div>
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
									<span
										class="text-body-accent dark:text-body-accent-dark text-sm inline-block mb-2"
										>Redirect URI (add this url to your OAuth Provider)
									</span>
									<CopiableTag value={redirectUri} />
									<Spacer size="md" />
									<form
										on:submit={() => {
											handleSave;
										}}>
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

										<Spacer size="md" />
										<Switch
											bind:checked={$form.isEnabled}
											onLabel="Enabled"
											offLabel="Disabled" />
									</form>
								</div>
							</div>
						</section>
					{/if}
					{#if method.type === "EMAIL"}
						<section
							class="p-10 antialiased border-t border-stroke-base dark:border-stroke-base-dark">
							<div class="grid grid-cols-5 gap-10">
								<div class="col-span-2">
									<Typography type="sectionTitle">Configuration</Typography>
									<Typography type="subTitle"
										>Configuration the email provider.
									</Typography>
								</div>
								<div class="col-span-3 gap-5">
									<form
										on:submit={() => {
											handleSave;
										}}>
										<Switch
											bind:checked={$form.isEnabled}
											onLabel="Enabled"
											offLabel="Disabled" />
									</form>
								</div>
							</div>
						</section>
					{/if}
					<Spacer size="md" />
					<section
						class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
						<div>
							<Button
								loading={isSaving}
								disabled={isSaving}
								on:click={handleSave}
								submit
								type="primary"
								center>Save</Button>
						</div>
					</section>
				</Card>
				<Spacer size="md" />
			</div>
		</div>
	</div>
{/if}
