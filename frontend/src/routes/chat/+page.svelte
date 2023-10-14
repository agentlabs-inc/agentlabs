<script lang="ts">
	import { loadMessages } from "$lib/stores/chat";
	import { onMount } from "svelte";

	onMount(() => {
		loadMessages([]);
	});
</script>
