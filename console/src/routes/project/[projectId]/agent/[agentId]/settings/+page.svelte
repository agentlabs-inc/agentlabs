<script lang="ts">
	import { Icon, DocumentDuplicate, CursorArrowRays, BookOpen } from "svelte-hero-icons";
	import DiscordIcon from "$lib/assets/img/discord-icon.svg";
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import type { PageData } from "./$types";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { fetchAgentDetails } from "$lib/usecases/agents/fetchAgentDetails";
	import { page } from "$app/stores";
	import MainTitleSkeleton from "$lib/components/common/skeleton/MainTitleSkeleton.svelte";
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import Tabs from "$lib/components/common/tabs/Tabs.svelte";
	import { projectStore } from "$lib/stores/project";
	import {
		onboardingPythonCode,
		onboardingTypescriptCode
	} from "$lib/components/project/agents/code-snippets/onboarding.snippet";

	import Monaco from "svelte-monaco";
	export let data: PageData;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			name: zod.string().min(3).max(20)
		}),
		validationMethod: "oninput"
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}
	};

	import { PUBLIC_AI_AGENT_DOMAIN } from "$env/static/public";
	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { projectAuthMethodsRoute, projectMembersRoute } from "$lib/routes/routes";

	const project = $projectStore.currentProject;

	console.log("project", project);

	if (!project) {
		throw new Error("Project not found");
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

	let currentStep: "open-frontend" | "authentication" | "send-message" = "open-frontend";

	let selectedTab = "python";

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

	const openFrontend = () => {
		window.open(`http://${projectSlug}.${PUBLIC_AI_AGENT_DOMAIN}/register`, "_blank");
		currentStep = "authentication";
	};

	const agentPromise = fetchAgentDetails($page.params.agentId);

	$: navItems = $projectStore.currentProjectId
		? [
				{
					label: "General",
					path: projectMembersRoute.path($projectStore.currentProjectId)
				},
				{
					label: "Settings",
					path: projectAuthMethodsRoute.path($projectStore.currentProjectId)
				}
		  ]
		: [];
</script>

<div>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Card>
				<section class="relative p-10 antialiased grid grid-cols-10">
					<div class="col-span-6">
						<Typography type="mainSectionTitle">Agent Settings</Typography>
						<Typography type="subTitle">Configure your agent like a pro.</Typography>
					</div>
				</section>
				<section
					class="p-10 antialiased border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="sectionTitle">Rename your agent</Typography>
							<Typography type="subTitle"
								>This will change the named displayed on your UI interface.</Typography>
						</div>
						<div class="col-span-3 gap-5">
							<form on:submit={handleValidation}>
								<Input
									bind:value={$form.name}
									label="Agent name"
									required
									name="name"
									errors={$errors?.name}
									type="text"
									placeholder="Project name" />
							</form>
						</div>
					</div>
				</section>
				<Spacer size="md" />
				<section
					class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
					<div>
						<Button
							disabled={!$form.name || !!$errors?.name}
							submit
							type="primary"
							center>Update</Button>
					</div>
				</section>
			</Card>
			<Spacer size="md" />
			<Card>
				<section class="p-10 antialiased">
					<div class="flex flex-col gap-3">
						<Typography type="sectionTitle">Danger zone</Typography>
						<Alert type="warning">
							Removing an agent will instantly make it unavailable for all your users
							and result in losing all data and events related to this agent. We
							assume you know what you are doing.
						</Alert>
					</div>
				</section>
				<Spacer size="md" />
				<section
					class="px-10 py-5 antialiased border-t border-stroke-base dark:border-stroke-base-dark flex justify-end">
					<div>
						<Button
							disabled={!$form.name || !!$errors?.name}
							submit
							type="danger"
							center>Delete forever</Button>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
