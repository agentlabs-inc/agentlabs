<script>
	import { page } from "$app/stores";
	import NotFound from "$lib/assets/img/illustrations/not-found.svg";
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import { homeRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { Home } from "svelte-hero-icons";
	import Button from "$lib/components/common/button/Button.svelte";

	const goBackHome = () => {
		goto(homeRoute.path());
	};
</script>

<div
	class="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
	<div class="max-w-5xl">
		<Card>
			<div class="flex flex-col items-center justify-center gap-3 py-5 px-10">
				<Typography type="mainTitle">Oops</Typography>
				<Typography type="subTitle">We can't find the page you're looking for.</Typography>
				<Button leftIcon={Home} on:click={goBackHome} type="primary">Go back home</Button>
				<img src={NotFound} alt="not found" class="w-43" />
			</div>
		</Card>
	</div>
</div>
