<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { ArrowRight } from "svelte-hero-icons";
	import Button from "$lib/components/common/button/Button.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { projectStore } from "$lib/stores/project";
	import OnboardingIllustration from "$lib/assets/img/illustrations/success.svg";
	import { goto } from "$app/navigation";
	import { projectOverviewRoute } from "$lib/routes/routes";

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("No project context found");
	}
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
