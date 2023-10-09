<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { retrieveProjectById } from "$lib/usecases/projects/retrieveProjectById";
	import { forgetUser } from "$lib/stores/auth";
	import { setCurrentProject } from "$lib/stores/project";
	import { goto } from "$app/navigation";
	import { loginRoute } from "$lib/routes/routes";

	let loading = true;

	export let projectId: string;

	$: if (projectId) {
		fetchContext();
	}

	const fetchContext = async () => {
		try {
			loading = true;
			const project = await retrieveProjectById(projectId);
			console.log(project);
			setCurrentProject(project);
		} catch (e: any) {
			if (e.status === 401) {
				forgetUser();
				await goto(loginRoute.path());
			} else {
				console.error(e);
			}
		} finally {
			loading = false;
		}
	};
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
