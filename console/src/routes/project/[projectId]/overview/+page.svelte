<script lang="ts">
	import { Icon, DocumentDuplicate, CodeBracket } from "svelte-hero-icons";
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import AgentsGrid from "$lib/components/project/agents/agents-grid/AgentsGrid.svelte";
	import { page } from "$app/stores";
	import { getCurrentProject } from "$lib/stores/project";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";

	const { projectId } = $page.params;

	const project = getCurrentProject();
</script>

<div>
	<TopCover>
		<section class="p-12 flex items-center gap-4">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>{project?.name}</span>
			<CopiableTag value={project.id} />
		</section>
	</TopCover>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<Card>
				<section class="p-10 antialiased min-h-[200px]">
					<Typography type="mainSectionTitle">Getting started</Typography>
					<Typography type="subTitle">Setup your project like a boss</Typography>
				</section>
				<section
					class="p-10 antialiased min-h-[200px] border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<Typography type="sectionTitle">Integrate in your server</Typography>
							<Typography type="subTitle"
								>Our SDKs let you control your agent frontend with bidirectionnal
								streaming and even more features.</Typography>
						</div>
						<div class="col-span-3 grid grid-cols-2 gap-5">
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>NodeJS SDK</div>
							</div>
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>Python SDK</div>
							</div>
						</div>
					</div>
				</section>
			</Card>

			<Spacer size="lg" />

			<section class="antialiased">
				<Typography type="mainSectionTitle">Your AI Agents</Typography>
				<Typography type="subTitle"
					>Configure a AI agent so you can use it with your frontend.</Typography>
			</section>

			<Spacer size="md" />

			<AgentsGrid projectId={projectId} />
		</div>
	</div>
</div>
