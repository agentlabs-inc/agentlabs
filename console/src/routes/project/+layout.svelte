<script>
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
</script>

<AuthOnly>
	<slot />
</AuthOnly>
