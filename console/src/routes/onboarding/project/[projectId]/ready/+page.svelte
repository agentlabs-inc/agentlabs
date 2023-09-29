<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { Icon, CheckCircle, CursorArrowRays } from "svelte-hero-icons";
	import Button from "$lib/components/common/button/Button.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Monaco from "svelte-monaco";
	import { PUBLIC_AI_AGENT_DOMAIN } from "$env/static/public";

	import {
		onboardingPythonCode,
		onboardingTypescriptCode
	} from "$lib/components/project/agents/code-snippets/onboarding.snippet";
	import Tabs from "$lib/components/common/tabs/Tabs.svelte";
	import { projectStore } from "$lib/stores/project";

	let currentStep: "open-frontend" | "authentication" | "send-message" = "open-frontend";

	let selectedTab = "python";

	const tabItems: {
		value: string;
		id: string;
		label: string;
	}[] = [
		{
			id: "python",
			label: "Python",
			value: "python"
		},
		{
			id: "typescript",
			label: "Typescript",
			value: "typescript"
		}
	];

	$: snippetValue =
		selectedTab === "python"
			? onboardingPythonCode({
					projectId: $projectStore.currentProjectId,
					slug: $projectStore.currentProject?.slug,
					agentId: "the-agent-id"
			  })
			: onboardingTypescriptCode({
					projectId: $projectStore.currentProjectId,
					slug: $projectStore.currentProject?.slug,
					// TODO: replace with the real agent id
					agentId: "the-agent-id"
			  });

	$: projectSlug = $projectStore.currentProject?.slug;

	const handleNewUser = () => {
		currentStep = "send-message";
	};

	const completeOnboarding = () => {
		// not implemented
	};

	const openFrontend = () => {
		window.open(`http://${projectSlug}.${PUBLIC_AI_AGENT_DOMAIN}`, "_blank");
		currentStep = "authentication";
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex flex-col items-center max-w-2xl m-auto justify-center">
			<div class="flex gap-2">
				<div class="text-body-success dark:text-body-success-dark">
					<Icon src={CheckCircle} width="30" />
				</div>
				<Typography type="mainSectionTitle">Your Agent UI is ready!</Typography>
			</div>

			<div class="mt-3" />
			<Typography type="subTitle"
				>You can now test your Agent UI to see how it looks.</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-7xl m-auto mt-[-30px]">
			<Card>
				<section class="p-10 antialiased min-h-[200px] grid grid-cols-6 gap-3">
					<div class="col-span-2">
						<div class={currentStep === "open-frontend" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 1</Typography>
							<Typography type="sectionTitle">Test your Agent UI</Typography>
							<Spacer size="sm" />
							<Button on:click={openFrontend} size="bigger" leftIcon={CursorArrowRays}
								>Open the demo Agent</Button>
							<Spacer size="md" />
						</div>
						<div class={currentStep === "authentication" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 2</Typography>
							<Typography type="sectionTitle"
								>Test your authentication portal</Typography>
							<Spacer size="sm" />
							<div class="grid grid-cols-2 gap-3">
								<Button
									on:click={handleNewUser}
									size="default"
									leftIcon={CursorArrowRays}>Authenticate</Button>
							</div>
							<Spacer size="md" />
						</div>
						<div class={currentStep === "send-message" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 3</Typography>
							<Typography type="sectionTitle">Implement your own logic</Typography>
							<Spacer size="sm" />
							<div class="grid grid-cols-2 gap-3">
								<Button
									on:click={completeOnboarding}
									size="bigger"
									leftIcon={CursorArrowRays}>Let's go!</Button>
							</div>
							<Spacer size="md" />
						</div>
					</div>
					<div class="flex items-center justify-center col-span-4">
						<div
							class="bg-background-quaternary dark:bg-background-quaternary-dark rounded-md py-4 px-4 flex flex-col items-left justify-center w-full h-full relative">
							<Tabs
								on:change={(event) => (selectedTab = event.detail.item.id)}
								defaultActive="python"
								items={tabItems} />
							<div class="w-full h-full rounded-md overflow-hidden">
								<div id="editor" class="h-full">
									<!-- event.detail is the monaco instance. All options are reactive! -->
									<Monaco
										options={{
											minimap: {
												enabled: false
											},
											readOnly: true,
											padding: {
												top: 30
											},
											language: "python",
											automaticLayout: true,
											fontSize: 16
										}}
										theme="vs-dark"
										on:ready={(event) => console.log(event.detail)}
										bind:value={snippetValue} />
								</div>
							</div>
						</div>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
