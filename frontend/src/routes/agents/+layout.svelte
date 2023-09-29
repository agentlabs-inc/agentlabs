<script>
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
</script>

<AuthOnly>
	<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
		<div class="flex flex-row grow">
			<div class="grow">
				<slot />
			</div>
		</div>
	</div>
</AuthOnly>
