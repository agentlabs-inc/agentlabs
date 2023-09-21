<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import AuthContext from "$lib/context/AuthContext.svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";

	export let data: LayoutData;
</script>

{#await data.lazy.context}
	<LoadingFrame />
{:then context}
	<AuthContext>
		<slot />
	</AuthContext>
{/await}
