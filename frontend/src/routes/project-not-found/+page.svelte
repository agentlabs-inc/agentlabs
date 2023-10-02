<script>
	import NotFound from "$lib/assets/img/illustrations/not-found.svg";
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
</script>

<div
	class="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
	<div class="max-w-5xl">
		<Card>
			<div class="flex flex-col items-center justify-center gap-3 py-5 px-10">
				<Typography type="mainTitle">Oops</Typography>
				<Typography type="subTitle"
					>The project you are looking for does not exist.</Typography>
				<Typography type="subTitle"
					>Go to your admin console and create one or use the correct project URL.</Typography>
				<img src={NotFound} alt="not found" class="w-43" />
			</div>
		</Card>
	</div>
</div>
