<script lang="ts">
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { projectStore } from "$lib/stores/project";
	import { onMount } from "svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import { Icon } from "svelte-hero-icons";
	import PageSkeleton from "$lib/components/common/skeleton/PageSkeleton.svelte";
	import { fetchAvailableAuthMethods } from "$lib/usecases/auth-methods/fetchAvailableAuthMethods";
	import { toastError } from "$lib/utils/toast";
	import type { AuthMethodListItem } from "$lib/entities/auth-method/auth-method-list-item";
	import Tag from "$lib/components/common/tag/Tag.svelte";
	import { authMethodRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("No project selected");
	}

	let isLoading = true;
	let builtInMethods: AuthMethodListItem[] = [];
	let oauthMethods: AuthMethodListItem[] = [];

	onMount(async () => {
		isLoading = true;
		try {
			const result = await fetchAvailableAuthMethods(project.id);
			builtInMethods = result.builtIn;
			oauthMethods = result.oauth;
		} catch (e: any) {
			toastError(e.message ?? "Failed to fetch auth methods");
		}
		isLoading = false;
	});
</script>

{#if isLoading}
	<PageSkeleton />
{:else}
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<section class="antialiased">
				<Typography type="mainSectionTitle">Built-in auth methods</Typography>
			</section>

			<Spacer size="md" />

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{#each builtInMethods as method}
					<Card clickable={method.available} disabled={!method.available}>
						<section
							class="p-10 antialiased flex flex-col gap-3 items-center text-center">
							<Icon
								src={method.heroIcon}
								width="20"
								class="m-auto text-body-subdued dark:text-body-subdued" />
							<Spacer size="xs" />
							<Typography type="cardSmallTitle">{method.name}</Typography>
							<Tag type={method.isEnabled ? "success" : "info"}
								>{method.statusLabel}</Tag>
						</section>
					</Card>
				{/each}
			</div>

			<div class="max-w-6xl m-auto mt-10">
				<section class="antialiased">
					<Typography type="mainSectionTitle">OAuth2 providers</Typography>
				</section>

				<Spacer size="md" />

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{#each oauthMethods as method}
						<Card
							clickable={method.available}
							disabled={!method.available}
							on:click={goto(authMethodRoute.path(project.id, method.id))}>
							<section
								class="p-10 antialiased flex flex-col gap-3 items-center text-center">
								<svelte:component this={method.componentIcon} />
								<Spacer size="xs" />
								<Typography type="cardSmallTitle">{method.name}</Typography>
								<Tag type={method.isEnabled ? "success" : "info"}
									>{method.statusLabel}</Tag>
							</section>
						</Card>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
