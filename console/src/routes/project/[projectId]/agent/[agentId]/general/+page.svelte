<script lang="ts">
	import { Icon, CursorArrowRays, BookOpen } from "svelte-hero-icons";
	import DiscordIcon from "$lib/assets/img/discord-icon.svg";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Tabs from "$lib/components/common/tabs/Tabs.svelte";
	import { projectStore } from "$lib/stores/project";
	import {
		onboardingPythonCode,
		onboardingTypescriptCode
	} from "$lib/components/project/agents/code-snippets/onboarding.snippet";

	import { env } from "$env/dynamic/public";
	import SDKSecretGenerator from "$lib/components/project/secret/SDKSecretGenerator.svelte";
	import { agentStore } from "$lib/stores/agent";
	import { validateEnv } from "$lib/utils/validateEnv";
	import MarkdownRenderer from "$lib/components/common/markdown/markdown-renderer.svelte";

	const project = $projectStore.currentProject;
	const agent = $agentStore.currentAgent;

	if (!project) {
		throw new Error("Project not found");
	}

	if (!agent) {
		throw new Error("Agent not found");
	}

	const validatedEnv = validateEnv(env);

	if (!validatedEnv) {
		throw new Error("Invalid env");
	}

	const { PUBLIC_AI_AGENT_DOMAIN, PUBLIC_DISCORD_URL } = validatedEnv;

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

	let selectedTab = "python";

	$: snippetValue =
		selectedTab === "python"
			? onboardingPythonCode({
					projectId: project.id,
					projectSlug: project.slug,
					agentId: agent.id
			  })
			: onboardingTypescriptCode({
					projectId: project.id,
					projectSlug: project.slug,
					agentId: agent.id
			  });

	$: projectSlug = project.slug;

	const openFrontend = () => {
		window.open(`http://${projectSlug}.${PUBLIC_AI_AGENT_DOMAIN}/register`, "_blank");
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
							<!-- TUTORIAL / IFRAME GOES HERE -->
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
					<SDKSecretGenerator />
					<Spacer size="md" />
					<div
						class="bg-background-quaternary dark:bg-background-quaternary-dark rounded-md py-4 px-4 flex flex-col items-left justify-center w-full relative">
						<Tabs
							on:change={(event) => (selectedTab = event.detail.item.id)}
							defaultActive="python"
							items={tabItems} />
						<div class="w-full h-full rounded-md overflow-hidden">
							<div id="editor" class="h-full">
								<MarkdownRenderer source={snippetValue} />
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
							<a
								href="https://docs.agentlabs.dev"
								target="_blank"
								class="antialiased border rounded-xl py-0 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={BookOpen} width="20" class="text-body-subdued" />
								</div>
								<div>Documentation</div>
							</a>

							{#if !!PUBLIC_DISCORD_URL}
								<a
									href={PUBLIC_DISCORD_URL}
									target="_blank"
									class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
									<div
										class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
										<img
											alt={"discord"}
											class="w-5"
											src={DiscordIcon}
											width="20" />
									</div>
									<div>Join the Discord</div>
								</a>
							{/if}
						</div>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
