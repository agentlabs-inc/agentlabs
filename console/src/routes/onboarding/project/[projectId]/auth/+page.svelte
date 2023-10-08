<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { ArrowRight, Envelope, Icon } from "svelte-hero-icons";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";
	import MicrosoftIcon from "$lib/components/auth/MicrosoftIcon.svelte";
	import type { MultiSelectItem } from "$lib/components/common/multi-select/types";
	import { initProjectAuthMethods } from "$lib/usecases/projects/initProjectAuthMethod";
	import MultiSelect from "$lib/components/common/multi-select/MultiSelect.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { projectOnboardingUseApplicationRoute } from "$lib/routes/routes";
	import { setCurrentProjectId } from "$lib/stores/project";
	import Alert from "$lib/components/common/alert/Alert.svelte";

	const availableAuthMethods: MultiSelectItem[] = [
		{
			id: "passwordless-email",
			label: "Passwordless email",
			value: "PASSWORDLESS_EMAIL",
			heroIcon: Envelope
		},
		{
			id: "google",
			label: "Google / Gmail",
			value: "GOOGLE",
			customIcon: GoogleIcon
		},
		{
			id: "github",
			label: "Github",
			value: "github",
			customIcon: GithubIcon,
			disabled: true,
			disabledLabel: "soon"
		},
		{
			id: "gitlab",
			label: "Gitlab",
			value: "gitlab",
			customIcon: GitlabIcon,
			disabled: true,
			disabledLabel: "soon"
		},
		{
			id: "microsoft",
			label: "Microsoft",
			value: "microsoft",
			customIcon: MicrosoftIcon,
			disabled: true,
			disabledLabel: "soon"
		}
	];

	$: canContinue = selectedItems.length > 0;

	let submitting = false;

	let selectedItems: MultiSelectItem[] = [];

	const handleSelect = (items: CustomEvent<MultiSelectItem[]>) => {
		selectedItems = items.detail;
	};

	const handleContinue = async () => {
		submitting = true;
		try {
			const { projectId } = $page.params;

			await initProjectAuthMethods(projectId, selectedItems);
			await goto(projectOnboardingUseApplicationRoute.path(projectId));
		} catch (e) {
			console.error(e);
		} finally {
			submitting = false;
		}
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex flex-col items-center max-w-2xl m-auto justify-center">
			<Typography type="mainSectionTitle">Your authentication portal</Typography>
			<div class="mt-3" />
			<Typography type="subTitle"
				>AgentLabs will handle the authentication for you so you don't have to think about
				it.</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-6xl m-auto mt-[-30px]">
			<Card>
				<section class="p-10 antialiased min-h-[200px] grid grid-cols-2 gap-3">
					<div>
						<Typography type="sectionTitle">Sign in methods</Typography>
						<Typography type="subTitle">
							Choose the methods your users can use to login.
						</Typography>
						<div class="my-3" />
						<Alert type="info">
							Only passwordless email will be applied for now. Other methods will be
							available soon.
						</Alert>
						<div class="my-10" />
						<MultiSelect items={availableAuthMethods} on:change={handleSelect} />
					</div>
					<div class="flex items-center justify-center">
						<div
							class="bg-blue-700 rounded-md py-10 px-10 flex items-center justify-center">
							<div
								class="rounded-md bg-white p-3 flex flex-col items-center justify-center gap-4">
								<Avatar
									alt="Logo icon"
									src="https://avatars.githubusercontent.com/u/54212400?v=4" />
								<div class="w-[100px] bg-[#F5F5F5] h-3 rounded-full" />
								<div
									class="w-[200px] bg-[#292946] py-2 rounded-md text-sm text-center text-white">
									Sign in
								</div>
								<div class="w-[100px] bg-[#F5F5F5] h-3 rounded-full" />
								{#each selectedItems as item}
									<div
										class="w-[200px] bg-gray-200 py-2 rounded-md flex items-center justify-center">
										{#if item.customIcon}
											<svelte:component this={item.customIcon} />
										{/if}
										{#if item.heroIcon}
											<Icon
												src={item.heroIcon}
												width="20"
												class="text-body-subdued" />
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div>
						<Spacer size="md" />
						<Button
							loading={submitting}
							on:click={handleContinue}
							disabled={!canContinue}
							leftIcon={ArrowRight}>Continue</Button>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
