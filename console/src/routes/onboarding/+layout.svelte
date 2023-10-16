<script>
	import AuthOnly from "$lib/context/AuthOnly.svelte";
</script>

<svelte:head>
	<title>Get started | AgentLabs</title>
</svelte:head>

<AuthOnly>
	<slot />
</AuthOnly>
