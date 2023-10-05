<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { Icon, CheckCircle, CursorArrowRays, ArrowRight } from "svelte-hero-icons";
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
	import { onMount } from "svelte";
	import OnboardingIllustration from "$lib/assets/img/illustrations/success.svg";
	import { goto } from "$app/navigation";
	import { projectOverviewRoute } from "$lib/routes/routes";

	let currentStep: "open-frontend" | "authentication" | "send-message" = "open-frontend";

	let selectedTab = "python";

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("No project context found");
	}

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
					projectId: project.id,
					projectSlug: project.slug,
					agentId: "the-agent-id"
			  })
			: onboardingTypescriptCode({
					projectId: project.id,
					projectSlug: project.slug,
					// TODO: replace with the real agent id
					agentId: "the-agent-id"
			  });

	$: projectSlug = project.slug;

	onMount(() => {
		console.log("Mounted", $projectStore.currentProject, $projectStore.list);
	});
</script>

<div>
	<TopCover />
	<div class="w-full">
		<div class="max-w-2xl m-auto mt-[-100px]">
			<Card>
				<div class="flex flex-col items-center justify-center gap-10 py-10 px-10">
					<div class="text-center">
						<Typography type="sectionTitle">You just saved a week of work!</Typography>
						<Typography type="subTitle"
							>Your Agent UI is now ready and configured. Go to your console to get
							started.</Typography>
						<Spacer size="md" />
						<div class="flex items-center justify-center">
							<Button
								on:click={() => {
									goto(projectOverviewRoute.path(project.id));
								}}
								size="bigger"
								rightIcon={ArrowRight}>Go to my console</Button>
						</div>
					</div>
					<img src={OnboardingIllustration} alt="not found" />

					<slot />
				</div>
			</Card>
		</div>
	</div>
</div>
