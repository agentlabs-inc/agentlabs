<script>
	import AuthOnly from "$lib/context/AuthOnly.svelte";
</script>

<AuthOnly>
	<slot />
</AuthOnly>
