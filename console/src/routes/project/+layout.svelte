<script>
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
	import { getCurrentProject } from "$lib/stores/project.js";

	// TODO: Find a better way to type project / store scoped variables.
	const projectId = getCurrentProject()?.id ?? "Project ID";
</script>

<AuthOnly>
	<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
		<TopNav />
		<div class="flex flex-row grow">
			<LeftNav projectId={projectId} />
			<div class="grow">
				<slot />
			</div>
		</div>
	</div>
</AuthOnly>
