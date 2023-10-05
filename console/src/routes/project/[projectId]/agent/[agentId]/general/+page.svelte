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
</script>

<div>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Card>
				<section class="relative p-10 antialiased grid grid-cols-10">
					<div class="col-span-6">
						<Typography type="mainSectionTitle">Getting started</Typography>
						<Typography type="subTitle"
							>Watch our quick video tour to get started like a pro!</Typography>
					</div>
					<div class="col-span-4">
						<div
							class="rounded-md overflow-hidden"
							style="position: relative; padding-bottom: 62.5%; height: 0;">
							<iframe
								src="https://www.loom.com/embed/12882db32c6f44caae36dac02a7a8b9a?sid=fcd12081-8939-475a-91fb-fbcd805357a7"
								frameborder="0"
								webkitallowfullscreen
								mozallowfullscreen
								allowfullscreen
								style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" />
						</div>
					</div>
				</section>
				<section
					class="p-10 antialiased min-h-[200px] border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="">
						<Typography type="label">Step 1</Typography>
						<Typography type="sectionTitle">Test your Agent UI</Typography>
						<Typography type="subTitle"
							>AgentLabs created the Agent UI Frontend for you, open your new Agent
							and ask him how to get started!</Typography>
						<Spacer size="sm" />
						<Button on:click={openFrontend} size="bigger" leftIcon={CursorArrowRays}
							>Open my agent</Button>
						<Spacer size="md" />
					</div>
				</section>

				<section
					class="p-10 antialiased min-h-[200px] border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="label">Step 2</Typography>
							<Typography type="sectionTitle">Integrate in your server</Typography>
							<Typography type="subTitle"
								>Our SDKs let you control your agent frontend with bidirectionnal
								streaming and even more features.</Typography>
						</div>
					</div>
					<Spacer size="md" />
					<div
						class="bg-background-quaternary dark:bg-background-quaternary-dark rounded-md py-4 px-4 flex flex-col items-left justify-center w-full h-[500px] relative">
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
				</section>
				<section
					class="p-10 antialiased border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="label">Step 3</Typography>
							<Typography type="sectionTitle">Community & Support</Typography>
							<Typography type="subTitle"
								>By joining the community you can stay in touch with our team and
								other developers who are currently building successful AI Agents.</Typography>
						</div>
						<div class="col-span-3 grid grid-cols-2 gap-5">
							<div
								class="antialiased border rounded-xl py-0 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={BookOpen} width="20" class="text-body-subdued" />
								</div>
								<div>Documentation</div>
							</div>
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<img alt={"discord"} class="w-5" src={DiscordIcon} width="20" />
								</div>
								<div>Join the Discord</div>
							</div>
						</div>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
